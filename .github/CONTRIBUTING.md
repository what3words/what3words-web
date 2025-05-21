# How to Contribute

## Table of Contents

- [Introduction](#introduction)
- Questions, Queries and Concerns
  - [Request Support](#request-support)
  - [Report an Error or Bug](#report-an-error-or-bug)
  - [Request a Feature](#request-a-feature)
- Code and Documentation
  - [Project Setup](#project-setup)
  - [Contribute Documentation](#contribute-documentation)
  - [Contribute Code](#contribute-code)
- [Attribution](#attribution)

## Introduction

Thank you so much for your interest in contributing! All types of contributions are encouraged and valued. See the [table of contents](#table-of-contents) for different ways to help and details about how this project handles them!📝

Please make sure to read the relevant section before making your contribution! It will make it a lot easier for us maintainers to make the most of it and smooth out the experience for all involved.

## Request Support

If you have a question about this project, how to use it, or just need clarification about something:

- Open an Issue at https://github.com/what3words/what3words-web-samples/issues
- Provide as much context as you can about what you're running into.
- Provide project and platform versions (nodejs, npm, etc), depending on what seems relevant. If not, please be ready to provide that information if maintainers ask for it.

Once it's filed:

- The project team will label the issue.
- Someone will try to have a response soon.
- If you or the maintainers don't respond to an issue for 30 days, the issue will be closed. If you want to come back to it, reply (once, please), and we'll reopen the existing issue. Please avoid filing new issues as extensions of one you already made.

## Report an Error or Bug

If you run into an error or bug with the project:

- Open an Issue at https://github.com/what3words/what3words-web-samples/issues
- Include _reproduction steps_ that someone else can follow to recreate the bug or error on their own.
- Provide project and platform versions (nodejs, npm, etc), depending on what seems relevant. If not, please be ready to provide that information if maintainers ask for it.

Once it's filed:

- The project team will label the issue.
- A team member will try to reproduce the issue with your provided steps. If there are no repro steps or no obvious way to reproduce the issue, the team will ask you for those steps and mark the issue as `needs-repro`. Bugs with the `needs-repro` tag will not be addressed until they are reproduced.
- If the team is able to reproduce the issue, it will be marked `needs-fix`, as well as possibly other tags (such as `critical`), and the issue will be left to be [implemented by someone](#contribute-code).
- If you or the maintainers don't respond to an issue for 30 days, the issue will be closed. If you want to come back to it, reply (once, please), and we'll reopen the existing issue. Please avoid filing new issues as extensions of one you already made.
- `critical` issues may be left open, depending on perceived immediacy and severity, even past the 30 day deadline.

## Request a Feature

If a project doesn't do something you need or want it to do:

- Open an Issue at https://github.com/what3words/what3words-web-samples/issues
- Provide as much context as you can about what you're running into.
- Please try and be clear about why existing features and alternatives would not work for you.

Once it's filed:

- The project team will label the issue.
- The project team will evaluate the feature request, possibly asking you more questions to understand its purpose and any relevant requirements. If the issue is closed, the team will convey their reasoning and suggest an alternative path forward.
- If the feature request is accepted, it will be marked for implementation with `feature-accepted`, which can then be done by either by a core team member or by anyone in the community who wants to [contribute code](#contribute-code).

Note: The team is unlikely to be able to accept every single feature request that is filed. Please understand if they need to say no.

## Project Setup

So you wanna contribute some code! That's great! This project uses GitHub Pull Requests to manage contributions, so [read up on how to fork a GitHub project and file a PR](https://guides.github.com/activities/forking) if you've never done it before.

If this seems like a lot or you aren't able to do all this setup, you might also be able to [edit the files directly](https://help.github.com/articles/editing-files-in-another-user-s-repository/) without having to do any of this setup. Yes, [even code](#contribute-code).

Please refer to the [installation instructions](../README.md#installation) and you should be ready to go!

## Contribute Documentation

Documentation is a super important, critical part of this project. Docs are how we keep track of what we're doing, how, and why. It's how we stay on the same page about our policies. And it's how we tell others everything they need in order to be able to use this project -- or contribute to it. So thank you in advance.

Documentation contributions of any size are welcome! Feel free to file a PR even if you're just rewording a sentence to be more clear, or fixing a spelling mistake!

To contribute documentation:

- [Set up the project](#project-setup).
- Edit or add any relevant documentation.
- Make sure your changes are formatted correctly and consistently with the rest of the documentation.
- Re-read what you wrote, and run a spellchecker on it to make sure you didn't miss anything.
- Write clear, concise commit message(s) using [conventional-changelog format](https://github.com/conventional-changelog/conventional-changelog-angular/blob/master/convention.md). Documentation commits should use `docs(<component>): <message>`.
- Go to https://github.com/what3words/what3words-web-samples/pulls and open a new pull request with your changes.
- If your PR is connected to an open issue, add a line in your PR's description that says `Fixes: #123`, where `#123` is the number of the issue you're fixing.

Once you've filed the PR:

- One or more maintainers will use GitHub's review feature to review your PR.
- If the maintainer asks for any changes, edit your changes, push, and ask for another review.
- If the maintainer decides to pass on your PR, they will thank you for the contribution and explain why they won't be accepting the changes. That's ok! We still really appreciate you taking the time to do it, and we don't take that lightly.
- If your PR gets accepted, it will be marked as such, and merged into the `latest` branch soon after. Your contribution will be distributed to the masses next time the maintainers tag a release

## Contribute Code

We like code commits a lot! They're super handy, and they keep the project going and doing the work it needs to do to be useful to others.

Code contributions of just about any size are acceptable!

The main difference between code contributions and documentation contributions is that contributing code requires inclusion of relevant tests for the code being added or changed. Contributions without accompanying tests will be held off until a test is added, unless the maintainers consider the specific tests to be either impossible, or way too much of a burden for such a contribution.

To contribute code:

- [Set up the project](#project-setup).
- Make any necessary changes to the source code.
- Include any [additional documentation](#contribute-documentation) the changes might need.
- Write tests that verify that your contribution works as expected.
- Write clear, concise commit message(s) using [conventional-changelog format](https://github.com/conventional-changelog/conventional-changelog-angular/blob/master/convention.md).
- Dependency updates, additions, or removals must be in individual commits, and the message must use the format: `<prefix>(deps): PKG@VERSION`, where `<prefix>` is any of the usual `conventional-changelog` prefixes, at your discretion.
- Go to https://github.com/what3words/what3words-web-samples/pulls and open a new pull request with your changes.
- If your PR is connected to an open issue, add a line in your PR's description that says `Fixes: #123`, where `#123` is the number of the issue you're fixing.

Once you've filed the PR:

- Barring special circumstances, maintainers will not review PRs until all checks pass.
- One or more maintainers will use GitHub's review feature to review your PR.
- If the maintainer asks for any changes, edit your changes, push, and ask for another review. Additional tags (such as `needs-tests`) will be added depending on the review.
- If the maintainer decides to pass on your PR, they will thank you for the contribution and explain why they won't be accepting the changes. That's ok! We still really appreciate you taking the time to do it, and we don't take that lightly.
- If your PR gets accepted, it will be marked as such, and merged into the `latest` branch soon after. Your contribution will be distributed to the masses next time the maintainers tag a release

## Provide Support on Issues

Helping out other users with their questions is a really awesome way of contributing to any community. It's not uncommon for most of the issues on an open source projects being support-related questions by users trying to understand something they ran into, or find their way around a known bug.

Sometimes, the `support` label will be added to things that turn out to actually be other things, like bugs or feature requests. In that case, suss out the details with the person who filed the original issue, add a comment explaining what the bug is, and change the label from `support` to `bug` or `feature`. If you can't do this yourself, @mention a maintainer so they can do it.

In order to help other folks out with their questions:

- Go to the issue tracker and [filter open issues by the `support` label](https://github.com/what3words/what3words-web/issues?q=is%3Aopen+is%3Aissue+label%3Asupport).
- Read through the list until you find something that you're familiar enough with to give an answer to.
- Respond to the issue with whatever details are needed to clarify the question, or get more details about what's going on.
- Once the discussion wraps up and things are clarified, either close the issue, or ask the original issue filer (or a maintainer) to close it for you.

Some notes on picking up support issues:

- Avoid responding to issues you don't know you can answer accurately.
- As much as possible, try to refer to past issues with accepted answers. Link to them from your replies with the `#123` format.
- Be kind and patient with users -- often, folks who have run into confusing things might be upset or impatient. This is ok. Try to understand where they're coming from, and if you're too uncomfortable with the tone, feel free to stay away or withdraw from the issue. (note: if the user is outright hostile or is violating the CoC, [refer to the Code of Conduct](CODE_OF_CONDUCT.md) to resolve the conflict).

## Clean Up Issues and PRs

Issues and PRs can go stale after a while. Maybe they're abandoned. Maybe the team will just plain not have time to address them any time soon.

In these cases, they should be closed until they're brought up again or the interaction starts over.

To clean up issues and PRs:

- Search the issue tracker for issues or PRs, and add the term `updated:<=YYYY-MM-DD`, where the date is 30 days before today.
- Go through each issue _from oldest to newest_, and close them if **all of the following are true**:
  - not opened by a maintainer
  - not marked as `critical`
  - not marked as `started` or `help wanted` (these might stick around for a while, in general, as they're intended to be available)
  - no explicit messages in the comments asking for it to be left open
  - does not belong to a milestone
- Leave a message when closing saying "Cleaning up stale issue. Please reopen or ping us if and when you're ready to resume this. See https://github.com/what3words/what3words-web/blob/latest/CONTRIBUTING.md#clean-up-issues-and-prs for more details."

## Review Pull Requests

While anyone can comment on a PR, add feedback, etc, PRs are only _approved_ by team members with maintainer permissions.

PR reviews use [GitHub's own review feature](https://help.github.com/articles/about-pull-request-reviews/), which manages comments, approval, and review iteration.

Some notes:

- You may ask for minor changes ("nitpicks"), but consider whether they are really blockers to merging: try to err on the side of "approve, with comments".
- _ALL PULL REQUESTS_ should be covered by a test: either by a previously-failing test, an existing test that covers the entire functionality of the submitted code, or new tests to verify any new/changed behavior. All tests must also pass and follow established conventions. Test coverage should not drop, unless the specific case is considered reasonable by maintainers.
- Please make sure you're familiar with the code or documentation being updated, unless it's a minor change (spellchecking, minor formatting, etc). You may @mention another project member who you think is better suited for the review, but still provide a non-approving review of your own.
- Be extra kind: people who submit code/doc contributions are putting themselves in a pretty vulnerable position, and have put time and care into what they've done (even if that's not obvious to you!) -- always respond with respect, be understanding, but don't feel like you need to sacrifice your standards for their sake, either. Just don't be a jerk about it?

## Create A Release

Once a PR is approved by a maintainer and merged, a follow up PR to version bump the relevant package(s) must be created by the maintainer using the `npm run bump:version` command. The latter applies semver versioning to any changes and is controlled by the release option (defaults to prerelease if not passed) e.g. `npm run --release=prerelease|patch|minor|major bump:version`. All version-linked changed files should be committed as one commit where possible and the branch published and merged on Github. Once merged, the maintainer will create a release in Github for your changes, which should be the same as the version in the aforementioned PR. This will trigger our continuous delivery and deployment workflows to make the changes live/available.

## Attribution

This guide was adapted from a sample generated using the WeAllJS `CONTRIBUTING.md` generator. [Make your own](https://npm.im/weallcontribute)!
