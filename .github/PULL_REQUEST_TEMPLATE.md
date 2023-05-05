* Short summary of what's included in the PR
* Give special note to breaking changes: List the exact changes or provide links to documentation.

### Checklist for PR Authors

- [ ] Link this PR to related issues if applicable
- [ ] This PR contains a single logical change (to build a better changelog)
- [ ] I have cleaned up the commit history (no useless army of tiny "Update file xyz" commits)
- [ ] PR title _doesn't_ contain a categorization prefix like "[chore]" or "feat:" -> There are labels for that

<!--
Remove the section and checklist items that do not apply.
For completed items, change [ ] to [x].

NOTE: these items are not required to open a PR and can be done afterwards,
while the PR is open.
-->

### Checklist for PR Reviewers

- [ ] Categorize the PR by setting a good title and adding one of the release labels (see below)

  <details>
  <summary>Labels that control the release</summary>

  * `major`: major
  * `minor`: minor
  * `patch`: patch
  * `performance`: patch
  * `skip-release`: none
  * `release`: Release after merge. Use together with a Label that doesn't immediately release, e.g. `internal`.
  * `internal`: none
  * `documentation`: none
  * `tests`: none
  * `dependencies`: none

  </details>
