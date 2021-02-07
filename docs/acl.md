## Access Control List (ACL)

This starter repository comes with a basic implementation of the ACL service. Conceptually each module will have its own ACL service extending the base implementation.

For example, an article module should have an `ArticleAclService` service to control access on the `Article` entity.

```
//src/article/services/article-acl.service.ts

import { Injectable } from '@nestjs/common';
import { BaseAclService } from '../../shared/acl/acl.service';

@Injectable()
export class ArticleAclService extends BaseAclService {
}

```

### Defining access rules

Access rules should be defined in acl-service's constructor method. For example, here we define an `ADMIN` can manage any article and a `USER` can read any article.

```
@Injectable()
export class ArticleAclService extends BaseAclService {

  constructor() {
    super();
    this.canDo(ROLE.ADMIN, [Action.Manage])
    this.canDo(ROLE.USER, [Action.Read]);
  }
}

```

`BaseAclService`'s `canDo(role: ROLE, actions: Action[], ruleCallback?: RuleCallback,)` method takes 3 parameters

- role: for which user `ROLE` we are defining the rule
- actions: an array of allowed `Action`
- ruleCallback: an optional callback method to define more custom logics

The list of actions are defined as `Action` enum and as follows

```
  - Create
  - Read
  - Update
  - Delete
  - Manage
  - List
```

Note `Manage` is super action, meaning anything can be done under this permission.

### Custom rules

More often we have situations where we need more custom logic for ACL. For example, only the article author can update this own article. We can define this logic as a callback function and pass it as `RuleCallback` as an optional third parameter of the `canDo` method.

```
@Injectable()
export class ArticleAclService extends BaseAclService {

  constructor() {
    super();
    this.canDo(ROLE.ADMIN, [Action.Manage])
    this.canDo(ROLE.USER, [Action.Read]);
    this.canDo(ROLE.USER, [Action.Update], this.isArticleAutor);
  }

  isArticleAutor(resource: Article, actor: Actor): boolean {
    return resource.author.id === actor.id;
  }
}

```

Note `RuleCallback` methods signature `(resource: Resource, actor: Actor): boolean`

# Usage of ACL service

Like any other service, ACL services are also injectable. In the context of the above example, `AtrcileService` should add `ArticleAclService` as its dependency.

```
@Injectable()
export class ArticleService {
  constructor(private acl: ArticleAclService) {}
}

```

To check user's access on any entity, we first have to use `forActor` method to get user-specific ACLs, and then use `canDoAction` on it to check `Action` specific permission.

To check whether a user can read and update this article, usage can like the following.

```

export class ArticleService {

  //...

  get(article: Article, user: User) {
    if(!this.aclService.forActor(user).canDoAction(Action.Read, article)) {
      throw new UnauthorizedException();
    }

    //...
  }

  update(article: Article, user: User){

    //...

    if(!this.aclService.forActor(user).canDoAction(Action.Update, article)) {
      throw new UnauthorizedException();
    }

    //...
  }

}

```
