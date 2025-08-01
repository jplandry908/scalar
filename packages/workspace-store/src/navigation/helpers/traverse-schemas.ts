import { getTag } from '@/navigation/helpers/get-tag'
import type { TagsMap, TraverseSpecOptions } from '@/navigation/types'
import type { TraversedSchema } from '@/schemas/navigation'
import type { OpenApiDocument } from '@/schemas/v3.1/strict/openapi-document'
import type { SchemaObject } from '@/schemas/v3.1/strict/schema'
import type { TagObject } from '@/schemas/v3.1/strict/tag'

/** Creates a traversed schema entry from an OpenAPI schema object.
 *
 * @param ref - JSON pointer reference to the schema in the OpenAPI document
 * @param name - Name of the schema, defaults to 'Unknown'
 * @param titlesMap - Map to store schema IDs and titles for mobile header navigation
 * @param getModelId - Function to generate unique IDs for schemas
 * @returns A traversed schema entry with ID, title, name and reference
 */
const createSchemaEntry = (
  ref: string,
  name = 'Unknown',
  titlesMap: Map<string, string>,
  getModelId: TraverseSpecOptions['getModelId'],
  tag?: TagObject,
  schema?: SchemaObject,
): TraversedSchema => {
  const id = getModelId({ name }, tag)

  // Use schema.title if available, otherwise fall back to name
  // @see https://json-schema.org/draft/2020-12/json-schema-core#section-4.3.5
  const title = (schema?.title as string) || name

  titlesMap.set(id, title)

  return {
    id,
    title,
    name,
    ref,
    type: 'model',
  }
}

/** Traverses the schemas in an OpenAPI document to build an array of model entries.
 *
 * This function processes each schema in components.schemas to:
 * - Filter out internal schemas (marked with x-internal) and schemas to ignore (marked with x-scalar-ignore)
 * - Create model entries with unique references and IDs
 * - Store model IDs and titles for mobile header navigation
 *
 * @param content - The OpenAPI document to traverse
 * @param titlesMap - Map to store schema IDs and titles for mobile header navigation
 * @param getModelId - Function to generate unique IDs for schemas
 * @returns Array of traversed schema entries
 */
export const traverseSchemas = (
  content: OpenApiDocument,
  /** Map of tagNames and their entries */
  tagsMap: TagsMap,
  /** Map of titles for the mobile header */
  titlesMap: Map<string, string>,
  getModelId: TraverseSpecOptions['getModelId'],
): TraversedSchema[] => {
  const schemas = content.components?.schemas ?? {}
  const untagged: TraversedSchema[] = []

  for (const name in schemas) {
    if (schemas[name]?.['x-internal'] || schemas[name]?.['x-scalar-ignore'] || !Object.hasOwn(schemas, name)) {
      continue
    }

    const ref = `#/content/components/schemas/${name}`

    // Add to tags
    if (schemas[name]?.['x-tags']) {
      schemas[name]['x-tags'].forEach((tagName: string) => {
        const { tag } = getTag(tagsMap, tagName)
        tagsMap.get(tagName)?.entries.push(createSchemaEntry(ref, name, titlesMap, getModelId, tag))
      })
    }
    // Add to untagged
    else {
      untagged.push(createSchemaEntry(ref, name, titlesMap, getModelId, undefined, schemas[name]))
    }
  }

  return untagged
}
