export type $ID<E extends {_id: string}> = E['_id'];
export type $UserID<E extends {user_id: string}> = E['user_id'];
export type $Name<E extends {name: string}> = E['name'];
export type $Username<E extends {username: string}> = E['username'];
export type $Email<E extends {email: string}> = E['email'];
export type RelationOneToOne<E extends {_id: string}, T> = {
    [x in $ID<E>]: T;
};
export type RelationOneToMany<E1 extends {_id: string}, E2 extends {_id: string}> = {
    [x in $ID<E1>]: Array<$ID<E2>>;
};
export type IDMappedObjects<E extends {_id: string}> = RelationOneToOne<E, E>;
export type UserIDMappedObjects<E extends {user_id: string}> = {
    [x in $UserID<E>]: E;
};
export type NameMappedObjects<E extends {name: string}> = {
    [x in $Name<E>]: E;
};
export type UsernameMappedObjects<E extends {username: string}> = {
    [x in $Username<E>]: E;
};
export type EmailMappedObjects<E extends {email: string}> = {
    [x in $Email<E>]: E;
};

export type Dictionary<T> = {
    [key: string]: T;
};