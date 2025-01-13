# Cheat Sheet (Testing)

Here is some advice about what to do next in a proof. Options 1, 3,
and 4 make use of the table below.

1. Prove the goal by decomposing it into sub-goals. In the table
  below, look at the entry in the row for the current goal formula and
  the `Prove` column. The entry suggests the proof statement to use
  next. (This is the advice that Deduce outputs when you write [`?`](./Reference.md#question-mark-proof).)

2. Work backwards from the goal using a
  [`suffices`](./Reference.md#suffices-proof-statement) statement. After the `by`
  keyword, write the reason, often
  [`definition`](./Reference.md#definition-proof) and/or
  [`rewrite`](./Reference.md#rewrite-proof), which transform the goal
  formula.

3. Work forwards from a [given](./Reference.md#given) with a
  [`have`](./Reference.md#have-proof-statement) statement. Look at the entry in
  the row for the given formula and the `Use` column. The table entry
  suggests what to write for the reason after the `by` keyword of your
  `have` statement. (This is the advice that Deduce outputs when you
  write [`help L`](./Reference.md#help-proof) where `L` is the label
  for the given.)

4. [`conclude`](./Reference.md#conclude-proof) the proof of the goal
   formula. For the reason after the `by` keyword, one can use a given
   according to the `Use` column in the table below, or one can prove
   the goal formula according to the `Prove` column.


| Formula        |  Prove        | Use      |
| -------------- | ------------- | -------- |
| `true`         | `.`           | No uses  |
| `false`        | [Contradiction](./Reference.md#contradiction) | implicitly proves anything |
| `P and Q`      |  `,` [Comma](./Reference.md#comma-logical-and-introduction) | (1) implicitly proves `P`, (2) implicitly proves `Q` |
| `P or Q`      | (1) implicit from `P`, (2) implicit from `Q` | [`cases`](./Reference.md#cases-disjunction-elimination) |
| `if P then Q` | [`assume`](./Reference.md#assume) | [`apply`-`to`](./Reference.md#apply-to-proof-modus-ponens) |
| `all x:T. P`  | [`arbitrary`](./Reference.md#arbitrary-forall-introduction), [`induction`](./Reference.md#induction) | [brackets](./Reference.md#instantiation-proof) |
| `some x:T. P` | [`choose`](./Reference.md#choose-exists-introduction) | [`obtain`](./Reference.md#obtain-exists-elimination) |
| `x = y`    | [`symmetric`](./Reference.md#symmetric-proof), [`transitive`](./Reference.md#transitive-proof), [`equations`](./Reference.md#equations), [`definition`](./Reference.md#definition-proof), [`rewrite`](./Reference.md#rewrite-proof) | [`symmetric`](./Reference.md#symmetric-proof), [`transitive`](./Reference.md#transitive-proof), [`rewrite`](./Reference.md#rewrite-proof), [`rewrite`-`in`](./Reference.md#rewrite-in-proof) |


