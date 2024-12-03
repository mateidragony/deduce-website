const cb00 = `
function search(List<Nat>, Nat) -> Nat {
  search(empty, y) = 0
  search(node(x, xs), y) =
    if x = y then 0
    else suc(search(xs, y))
}`

const cb01 = `
theorem zero_add: all n:Nat.
  0 + n = n
proof
  arbitrary n:Nat
  conclude 0 + n = n by definition operator+
end`

const cb02 = `
function search(List<Nat>, Nat) -> Nat {
  search(empty, y) = 0
  search(node(x, xs), y) =
    if x = y then 0
    else suc(search(xs, y))
}

theorem search_take: all xs: List<Nat>. all y:Nat.
    not (y ∈ set_of(take(search(xs, y), xs)))
proof
  induction List<Nat>
  case empty {
    arbitrary y:Nat
    suffices not (y ∈ ∅) by definition {search, take, set_of}
    empty_no_members<Nat>
  }
  case node(x, xs') suppose
    IH: (all y:Nat. not (y ∈ set_of(take(search(xs', y), xs'))))
  {
    arbitrary y:Nat
    switch x = y for search {
      case true {
        suffices not (y ∈ ∅) by definition {take, set_of}
        empty_no_members<Nat>
      }
      case false assume xy_false: (x = y) = false {
        suffices not (y ∈ single(x) ∪ set_of(take(search(xs', y), xs')))
            by definition {take, set_of}
        suppose c: y ∈ single(x) ∪ set_of(take(search(xs', y), xs'))
        cases (apply member_union<Nat> to c)
        case y_in_x: y ∈ single(x) {
          have: x = y by apply single_equal<Nat> to y_in_x
          conclude false by rewrite xy_false in (recall x = y)
        }
        case y_in_rest: y ∈ set_of(take(search(xs', y), xs')) {
          conclude false by apply IH to y_in_rest
        }
      }
    }
  }
end`



const codeBlocks = {
    "home-example1" : cb00,
    "home-example2" : cb01,
    "home-example3" : cb02,
}