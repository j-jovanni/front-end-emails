<template>
  <h1 class="font-semibold text-4xl mb-4">Create Recipients</h1>

  <VaCard>
    <VaCardTitle>Recipients</VaCardTitle>
    <VaCardContent>
      <VaForm ref="form" @submit.prevent="submit">
        <VaSelect
          v-model="formData.templateId"
          :rules="[(v) => v || 'Field is required']"
          :options="templates"
          label="Template"
        />
        <VaInput
          v-model="formData.email"
          :rules="[validators.required, validators.email]"
          class="mb-4"
          label="Email"
          type="email"
        />

        <div class="flex justify-center mt-4">
          <VaButton class="w-full" @click="submit"> Create</VaButton>
        </div>
      </VaForm>
    </VaCardContent>
  </VaCard>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useForm, useToast } from 'vuestic-ui'
import { validators } from '../../services/utils'
import axios from 'axios'

const { validate } = useForm('form')
const { push } = useRouter()
const { init } = useToast()

const templates = ref<any[]>([])

const formData = reactive({
  email: '',
  templateId: '',
  unsubscribed: false,
})

const submit = async () => {
  if (validate()) {
    await addRecipient()
  }
}
const loadTemplates = async () => {
  try {
    const templatesResponse = await axios.get('http://localhost:8083/templates')
    const values = templatesResponse.data.map((val) => {
      return {
        value: val.ID,
        text: val.Subject,
      }
    })
    templates.value = values
  } catch (error) {
    console.log('Error loading templates:', error)
  }
}
const addRecipient = async () => {
  await axios
    .post('http://localhost:8082/recipients', { ...formData, templateId: formData.templateId.value })
    .then((response) => {
      init({ message: 'Create Recipients', color: 'success' })
    })
    .catch((error) => {
      init({ message: error.toString(), color: 'danger' })
    })
}
onMounted(async () => {
  await loadTemplates()
})
</script>
