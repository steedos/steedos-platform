---
title: GraphQL API
---

[GraphQL](http://www.graphql.org/) is a new API standard that provides a more efficient, powerful and flexible alternative to REST. It was developed and [open-sourced by Facebook](https://facebook.github.io/react/blog/2015/02/20/introducing-relay-and-graphql.html) and is now maintained by a large community of companies and individuals from all over the world.

当你在 Steedos 中配置了对象以后，Steedos 为你自动生成 GraphQL API。（即将发布）

例如你定义了对象 Post

```yaml
name: Post
fields:
  name: 
    type: String
  description:
    type: String
  is_publised:
    type: Boolean
  user:
    type: User
```

Steedos 自动生成以下 GraphQL Schama
```graphql
type User {
  id: ID,
  name: String
  username: String
}
type Post {
  id: ID
  name: String
  description: String
  isPublished: String
  author: User
}

type Query {
  Posts(where): [Post]
  Post(id: String): Post
}

type Mutation {
  createPost(data):Post
  updatePost(data):Post
  deletePost(id: String):Post
}
```
