
declare var Meteor:any;

export const isMeteor = () => {
    return (typeof Meteor != "undefined")            
}