# Reader-contract templates

One brief, two artifacts, two readers. These templates carry the split.

The shape they fill is `{ defaults, surfaces[] }`, loaded by
`src/content/reader-contract.ts` and compiled into the generation prompt by the
copywriter, editor, and ghost-writer roles. Fork one, fill the placeholders, and
generate each artifact by naming its surface.

```bash
npm run generate -- generate \
  --reader-contract path/to/contract.json \
  --surface client-brief \
  ...

npm run generate -- generate \
  --reader-contract path/to/contract.json \
  --surface operator-playbook \
  ...
```

Verify a contract before you generate from it:

```bash
npm run reader:templates
```

That loads every template under this directory through the real loader and fails
on the authoring mistakes the loader itself swallows.

## Not the same file as `reader:check`

`npm run reader:check` runs `tools/lib/encounter-audit.mjs`, which reads a
*repository's* root `reader-contract.json` to detect drift between rendered copy
and its source files. It cares about `sourceRoots` and `renderedRoots`.

These templates target the *generation* path. Same filename, same schema core,
different job — a generation contract has no source roots to audit, and an audit
contract is not written to be forked per engagement.

## `dual-audience-engagement.json`

Two surfaces for any engagement where one artifact goes to the client and one
stays with the operator.

**`client-brief`** — `plainness: lay`. The reader has none of the trade's
vocabulary and reads this once, probably on a phone, probably the night before.
Its precision locks are the things that stay exact no matter how plain the prose
gets: times, locations, what to bring, and the rules the reader is personally
bound by. Its deny terms are trade shorthand that means nothing to them.

**`operator-playbook`** — `plainness: practitioner`. The reader is the operator
mid-engagement, with no time to reconstruct reasoning. Its deny terms do
something the client surface's do not: they make an *unsourced verification
claim unwritable*. "Verified", "confirmed", "should be fine", and "standard
practice" all resolve to the same replacement — name the source and the date it
was checked, or say unverified.

That is deliberate. An operator playbook is where a fee, a permit threshold, or
an access-hours rule gets acted on, and where being confidently wrong costs the
engagement. A generator that will happily write "verified" over an assumption
produces a document that reads more trustworthy the less grounded it is.

## Two loader behaviours worth knowing before you author

**Arrays on a surface replace the defaults; they do not merge.** The loader
merges shallowly (`{...defaults, ...surface}`), so a surface that sets its own
`precisionLocks` loses the defaults' entirely. Omit the key to inherit; state the
complete list when you set it. `keepTerms` and `avoidTerms` are the exception —
those *are* merged, because `allowTerms` and `denyTerms` fold into them. The
inconsistency is real; author around it.

**A `denyTerm` without a `replacement` silently becomes the string
"reader-facing language".** That is not useful guidance to a generator. Every
deny term needs a concrete replacement. `npm run reader:templates` fails on this.

The `reason` field on a deny term is ignored by the loader. Write it anyway — it
is what stops a later editor from deleting a rule they no longer understand.

## `examples/family-portrait-session.json`

The template filled in against a real case: a three-location morning portrait
session at a public forest preserve, family of five, possibly a dog.

Worth reading for how specific the locks get once there is a real engagement
behind them. "Rules the reader is bound by" becomes "the leash rule, if a dog is
coming." "Fees and permit thresholds" becomes a lock that names the source and
check date, because the source brief asserted a permit fee, an insurance
minimum, and an application lead time that nobody had pulled at the district.
