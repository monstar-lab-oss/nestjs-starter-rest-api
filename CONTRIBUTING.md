# Contribution guide

## Project tools

- Github for code and issues management

### Branch rules:

1. Following branches should be used for primary code management

   1. `master` there can be only this branch. This hold all the latest already released code.

   - in case we are doing tag based release, `master` can be used as stable bleeding edge releasable code.

2. `{type}/{GithubIssueNo}-issue-one-liner` should be the format for branch naming
   1. See [Type](#__type) section for branch `{type}`.
   2. Find `{GithubIssueNo}` in Github.

### Pull requests

Pull requests are the only way to propose a value you want to add. Following is a general workflow for submitting any requests.

1. Clone the repo and create your branch from `master`.
2. If you've added code that should be tested
3. Ensure that your code doesn't fail to build
4. Make pull request to `master` branch
5. Assign respective developers to review and merge pull request

### Commit Message Guidelines

We have very precise rules over how our git commit messages can be formatted. This leads to **more
readable messages** that are easy to follow when looking through the **project history**. But also,
we use the git commit messages to **generate the changelog**.

#### Commit message format

Each commit message consists of a **header**, a **body** and a **footer**. The header has a special
format that includes a **type**, a **scope** and a **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and the **scope** of the header is optional.

Any line of the commit message cannot be longer 74 characters! This allows the message to be easier
to read on GitHub as well as in various git tools.

<a name="__type"></a>

#### Type

Must be one of the following:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing
  semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system, CI configuration or external dependencies (example scopes: gulp, broccoli, npm)
- **ci**: Any changes to our CI configuration files and scripts (Travis, Circle CI, BrowserStack, SauceLabs, AWS CodeBuild)
- **chore**: Other changes that don't modify `src` or `test` files

#### Scope

The scope could be any module name of the commit change. For example `Compiler`, `ElementInjector`, etc.

#### Subject

The subject contains succinct description of the change:

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize first letter
- no dot (.) at the end

#### Body

Just as in the **subject**, use the imperative, present tense.

- The body should include the motivation for the change and contrast this with previous behavior.
- The body can include multiple line starting with `-`

#### Footer

The footer should contain any information about **Breaking Changes** and is also the place to
reference Github issues that this commit **Closes**.

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space or two newlines. The rest of the commit message is then used for this.

### Opening Issues

Before opening any issues, it is prefered to ensure that the issue is not already reported by searching [here](https://github.com/monstar-lab-oss/nestjs-starter-rest-api/issues).
