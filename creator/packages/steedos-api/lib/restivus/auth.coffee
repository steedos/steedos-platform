@Auth or= {}

###
  A valid user will have exactly one of the following identification fields: id, username, or email
###
userValidator = Match.Where (user) ->
  check user,
    id: Match.Optional String
    username: Match.Optional String
    email: Match.Optional String

  if _.keys(user).length is not 1
    throw new Match.Error 'User must have exactly one identifier field'

  return true


###
  Return a MongoDB query selector for finding the given user
###
getUserQuerySelector = (user) ->
  if user.id
    return {'_id': user.id}
  else if user.username
    return {'username': user.username}
  else if user.email
    return {'emails.address': user.email}

  # We shouldn't be here if the user object was properly validated
  throw new Error 'Cannot create selector from invalid user'


###
  Log a user in with their password
###
@Auth.loginWithPassword = (user, password) ->
  if not user or not password
    throw new Meteor.Error 401, 'Unauthorized'

  # Validate the login input types
  check user, userValidator
  check password, String

  # Retrieve the user from the database
  authenticatingUserSelector = getUserQuerySelector(user)
  authenticatingUser = Meteor.users.findOne(authenticatingUserSelector)

  if not authenticatingUser
    throw new Meteor.Error 401, 'Unauthorized'
  if not authenticatingUser.services?.password
    throw new Meteor.Error 401, 'Unauthorized'

  # Authenticate the user's password
  passwordVerification = Accounts._checkPassword authenticatingUser, password
  if passwordVerification.error
    throw new Meteor.Error 401, 'Unauthorized'

  # Add a new auth token to the user's account
  authToken = Accounts._generateStampedLoginToken()
  hashedToken = Accounts._hashStampedToken authToken
  Accounts._insertHashedLoginToken authenticatingUser._id, hashedToken

  space_users = db.space_users.find({user: authenticatingUser._id}).fetch()
  spaces = []
  _.each space_users, (su)->
    space = db.spaces.findOne(su.space)
    # space must be paid, and user must be admins
    if space?.is_paid and _.indexOf(space.admins, su.user)>=0
      spaces.push
        _id: space._id
        name: space.name
  return {authToken: authToken.token, userId: authenticatingUser._id, adminSpaces: spaces}
