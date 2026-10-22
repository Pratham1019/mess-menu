import { parse, type Node } from "acorn";

// Syntax only: no eval, VM, function execution, imports or arbitrary expressions.
type Syntax = Node & Record<string, unknown>;
function string(node: Syntax): string | undefined {
  if (node.type === "Identifier") return node.name as string;
  if (node.type === "Literal" && typeof node.value === "string")
    return node.value;
  if (
    node.type === "TemplateLiteral" &&
    (node.expressions as unknown[]).length === 0
  )
    return ((node.quasis as Syntax[])[0]?.value as { cooked: string })?.cooked;
  return undefined;
}
function literal(node: Syntax, depth = 0): unknown {
  if (depth > 16) throw new Error("Literal too deep");
  if (
    node.type === "Literal" &&
    (typeof node.value === "string" ||
      typeof node.value === "number" ||
      typeof node.value === "boolean" ||
      node.value === null)
  )
    return node.value;
  if (node.type === "TemplateLiteral" && string(node) !== undefined)
    return string(node);
  if (node.type === "ArrayExpression")
    return (node.elements as Syntax[]).map((n) => literal(n, depth + 1));
  if (node.type === "ObjectExpression") {
    const result: Record<string, unknown> = Object.create(null) as Record<
      string,
      unknown
    >;
    for (const property of node.properties as Syntax[]) {
      if (
        property.type !== "Property" ||
        property.computed ||
        property.method ||
        property.kind !== "init"
      )
        throw new Error("Not a literal property");
      const key = string(property.key as Syntax);
      if (
        !key ||
        ["__proto__", "constructor", "prototype"].includes(key) ||
        Object.hasOwn(result, key)
      )
        throw new Error("Invalid literal key");
      result[key] = literal(property.value as Syntax, depth + 1);
    }
    return result;
  }
  throw new Error("Unsupported source expression");
}
export function extractFc1(bundle: string): unknown {
  if (Buffer.byteLength(bundle) > 1_000_000)
    throw new Error("Bundle too large");
  const ast = parse(bundle, {
    ecmaVersion: "latest",
    sourceType: "module",
  }) as unknown as Syntax;
  // Resolve only module-scope bindings. Minified function-local variables often
  // reuse the same identifier; treating those as the menu binding is unsafe.
  const declarations = (ast.body as Syntax[])
    .filter((n) => n.type === "VariableDeclaration")
    .flatMap((n) => n.declarations as Syntax[]);
  const definitions = new Map<string, Syntax[]>();
  for (const node of declarations)
    if ((node.id as Syntax).type === "Identifier" && node.init) {
      const name = string(node.id as Syntax)!;
      definitions.set(name, [
        ...(definitions.get(name) ?? []),
        node.init as Syntax,
      ]);
    }
  const candidates: Syntax[] = [];
  const configs = declarations
    .flatMap((n) =>
      (n.init as Syntax)?.type === "ArrayExpression"
        ? ((n.init as Syntax).elements as Syntax[])
        : [n.init as Syntax],
    )
    .filter(Boolean);
  for (const node of configs)
    if (node.type === "ObjectExpression") {
      const props = (node.properties as Syntax[]).filter(
        (p) => p.type === "Property" && !p.computed,
      );
      if (
        !props.some(
          (p) =>
            string(p.key as Syntax) === "key" &&
            string(p.value as Syntax) === "Food Court-1",
        )
      )
        continue;
      const data = props.find((p) => string(p.key as Syntax) === "data")
        ?.value as Syntax | undefined;
      if (!data) throw new Error("Missing FC1 data");
      if (data.type === "Identifier") {
        const matches = definitions.get(string(data)!);
        if (matches?.length !== 1) throw new Error("Ambiguous FC1 binding");
        candidates.push(matches[0]!);
      } else candidates.push(data);
    }
  if (candidates.length !== 1) throw new Error("Ambiguous FC1 configuration");
  return literal(candidates[0]!);
}
