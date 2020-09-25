
/**
 * User Profile
 */
var profile = {
    userName: 'zhuangjianguo@steedos.com',
    nameIdFormat: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
    firstName: 'Jack',
    lastName: 'Zhuang',
    displayName: 'Jack Zhuang',
    email: 'zhuangjianguo@steedos.com',
    mobilePhone: '+86-01777701',
    groups: 'Users'
  }
  
  /**
   * SAML Attribute Metadata
   */
  var metadata = [
  // {
  //   id: "firstName",
  //   optional: false,
  //   displayName: 'First Name',
  //   description: 'The given name of the user',
  //   multiValue: false
  // }, {
  //   id: "lastName",
  //   optional: false,
  //   displayName: 'Last Name',
  //   description: 'The surname of the user',
  //   multiValue: false
  // }, 
  {
    id: "userId",
    optional: true,
    displayName: 'User Id',
    description: 'The id of the user',
    multiValue: false
  },
  {
    id: "username",
    optional: true,
    displayName: 'User Name',
    description: 'The username of the user',
    multiValue: false
  },
  {
    id: "name",
    optional: true,
    displayName: 'Display Name',
    description: 'The display name of the user',
    multiValue: false
  }, {
    id: "email",
    optional: false,
    displayName: 'E-Mail Address',
    description: 'The e-mail address of the user',
    multiValue: false
  },{
    id: "mobile",
    optional: true,
    displayName: 'Mobile',
    description: 'The mobile phone of the user',
    multiValue: false
  },
  // {
  //   id: "groups",
  //   optional: true,
  //   displayName: 'Groups',
  //   description: 'Group memberships of the user',
  //   multiValue: true
  // }, {
  //   id: "userType",
  //   optional: true,
  //   displayName: 'User Type',
  //   description: 'The type of user',
  //   options: ['Admin', 'User']
  // }
];
  
  module.exports = {
    user: profile,
    metadata: metadata
  }
  