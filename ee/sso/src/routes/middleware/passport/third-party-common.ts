
import fetch from 'node-fetch';
import { User } from '../../../collections/users';

import { getTenantId } from "../../../context";

import env from "../../../context/environment";
import { newid } from "../../../context/hashing";
const jwt = require("jsonwebtoken")

const authError = function (done, message, err = null) {
    return done(
        message,
        null
    );
};

const createASession = function(userId, session){
    return {
        createdAt: new Date().toISOString(),
        lastAccessedAt: new Date().toISOString(),
        ...session,
        userId,
    }
}

export const authenticateThirdParty = async (
    thirdPartyUser,
    requireLocalAccount = true,
    done,
    saveUserFn
) => {
    if (!saveUserFn) {
        throw new Error("Save user function must be provided");
    }
    if (!thirdPartyUser.provider) {
        return authError(done, "third party user provider required");
    }
    if (!thirdPartyUser.userId) {
        return authError(done, "third party user id required");
    }
    if (!thirdPartyUser.email) {
        return authError(done, "third party user email required");
    }

    const userId = thirdPartyUser.userId;

    let dbUser = await User.findById(userId);

    // fallback to loading by email
    if (!dbUser) {
        const userByEmail = await User.findByEmail(thirdPartyUser.email);
        if (userByEmail) {
            dbUser = userByEmail;
        }
    }


    // exit early if there is still no user and auto creation is disabled
    if (!dbUser && requireLocalAccount) {
        return authError(
            done,
            "Email does not yet exist. You must set up your local budibase account first."
        )
    }

    // first time creation
    if (!dbUser) {
        // setup a blank user using the third party id
        dbUser = {
            _id: userId,
            email: thirdPartyUser.email,
            roles: {},
        }
    }

    dbUser = await syncUser(dbUser, thirdPartyUser)

    // never prompt for password reset
    dbUser.forceResetPassword = false

    // create or sync the user
    try {
        await saveUserFn(dbUser, false, false)
    } catch (err) {
        console.log(`err`, err)
        return authError(done, err)
    }

    // now that we're sure user exists, load them from the db
    dbUser = await User.findById(dbUser._id);

    // authenticate
    const sessionId = newid()
    const tenantId = getTenantId()
    await createASession(dbUser._id, { sessionId, tenantId })

    dbUser.token = jwt.sign(
        {
            userId: dbUser._id,
            sessionId,
        },
        env.JWT_SECRET,
    )

    return done(null, Object.assign({}, dbUser, { id: dbUser._id, thirdPartyUser: thirdPartyUser }));
};


async function syncProfilePicture(user, thirdPartyUser) {
    const pictureUrl = thirdPartyUser.profile._json.picture
    if (pictureUrl) {
      const response = await fetch(pictureUrl, {})
  
      if (response.status === 200) {
        const type: any = response.headers.get("content-type")
        if (type.startsWith("image/")) {
          user.pictureUrl = pictureUrl
        }
      }
    }
  
    return user
  }
  
  /**
   * @returns a user that has been sync'd with third party information
   */
  async function syncUser(user, thirdPartyUser) {
    // provider
    user.provider = thirdPartyUser.provider
    user.providerType = thirdPartyUser.providerType
  
    if (thirdPartyUser.profile) {
      const profile = thirdPartyUser.profile
  
      if (profile.name) {
        const name = profile.name
        // first name
        if (name.givenName) {
          user.firstName = name.givenName
        }
        // last name
        if (name.familyName) {
          user.lastName = name.familyName
        }
      }
  
      user = await syncProfilePicture(user, thirdPartyUser)
  
      // profile
      user.thirdPartyProfile = {
        ...profile._json,
      }
    }
  
    // oauth tokens for future use
    if (thirdPartyUser.oauth2) {
      user.oauth2 = {
        ...thirdPartyUser.oauth2,
      }
    }
  
    return user
  }
  