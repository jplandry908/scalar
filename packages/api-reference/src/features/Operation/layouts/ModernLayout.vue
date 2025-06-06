<script setup lang="ts">
import { ScalarErrorBoundary, ScalarMarkdown } from '@scalar/components'
import type {
  Collection,
  Operation,
  Server,
} from '@scalar/oas-utils/entities/spec'
import type { OpenAPIV3_1 } from '@scalar/openapi-types'
import type { TransformedOperation } from '@scalar/types/legacy'
import { computed, useId } from 'vue'

import { Anchor } from '@/components/Anchor'
import { Badge } from '@/components/Badge'
import OperationPath from '@/components/OperationPath.vue'
import {
  Section,
  SectionColumn,
  SectionColumns,
  SectionContent,
  SectionHeader,
  SectionHeaderTag,
} from '@/components/Section'
import { ExampleRequest } from '@/features/ExampleRequest'
import { ExampleResponses } from '@/features/ExampleResponses'
import type { Schemas } from '@/features/Operation/types/schemas'
import { TestRequestButton } from '@/features/TestRequestButton'
import { useConfig } from '@/hooks/useConfig'
import {
  getOperationStability,
  getOperationStabilityColor,
  isOperationDeprecated,
} from '@/libs/openapi'

import Callbacks from '../components/callbacks/Callbacks.vue'
import OperationParameters from '../components/OperationParameters.vue'
import OperationResponses from '../components/OperationResponses.vue'

const { operation } = defineProps<{
  id?: string
  collection: Collection
  server: Server | undefined
  operation: Operation
  /** @deprecated Use `operation` instead */
  transformedOperation: TransformedOperation
  schemas?: Schemas
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const labelId = useId()
const config = useConfig()

/** The title of the operation (summary or path) */
const title = computed(() => operation.summary || operation.path)

const handleDiscriminatorChange = (type: string) => {
  emit('update:modelValue', type)
}
</script>

<template>
  <Section
    :id="id"
    :aria-labelledby="labelId"
    :label="title"
    tabindex="-1">
    <SectionContent :loading="config.isLoading">
      <Badge
        v-if="getOperationStability(operation)"
        :class="getOperationStabilityColor(operation)">
        {{ getOperationStability(operation) }}
      </Badge>
      <div :class="isOperationDeprecated(operation) ? 'deprecated' : ''">
        <SectionHeader>
          <Anchor :id="id ?? ''">
            <SectionHeaderTag
              :id="labelId"
              :level="3">
              {{ title }}
            </SectionHeaderTag>
          </Anchor>
        </SectionHeader>
      </div>
      <SectionColumns>
        <SectionColumn>
          <div class="operation-details">
            <ScalarMarkdown
              :value="operation.description"
              withImages
              withAnchors
              transformType="heading"
              :anchorPrefix="id" />
            <OperationParameters
              :operation="operation"
              :schemas="schemas"
              @update:modelValue="handleDiscriminatorChange">
            </OperationParameters>
            <OperationResponses
              :operation="transformedOperation"
              :schemas="schemas" />

            <!-- Callbacks -->
            <ScalarErrorBoundary>
              <Callbacks
                v-if="operation.callbacks"
                :callbacks="operation.callbacks"
                :collection="collection"
                :schemas="schemas" />
            </ScalarErrorBoundary>
          </div>
        </SectionColumn>
        <SectionColumn>
          <div class="examples">
            <ScalarErrorBoundary>
              <ExampleRequest
                :collection="collection"
                fallback
                :operation="operation"
                :server="server"
                :transformedOperation="transformedOperation"
                :schemas="schemas"
                @update:modelValue="handleDiscriminatorChange">
                <template #header>
                  <OperationPath
                    class="example-path"
                    :deprecated="transformedOperation.information?.deprecated"
                    :path="transformedOperation.path" />
                </template>
                <template #footer>
                  <TestRequestButton :operation="operation" />
                </template>
              </ExampleRequest>
            </ScalarErrorBoundary>
            <ScalarErrorBoundary>
              <ExampleResponses
                :responses="operation.responses"
                style="margin-top: 12px" />
            </ScalarErrorBoundary>
          </div>
        </SectionColumn>
      </SectionColumns>
    </SectionContent>
  </Section>
</template>

<style scoped>
.examples {
  position: sticky;
  top: calc(var(--refs-header-height) + 24px);
}
.deprecated * {
  text-decoration: line-through;
}
.example-path {
  color: var(--scalar-color-2);
  font-family: var(--scalar-font-code);
}
.example-path :deep(em) {
  color: var(--scalar-color-1);
  font-style: normal;
}
</style>
