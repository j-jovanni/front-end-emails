<template>
  <h1 class="font-semibold text-4xl mb-4">Create Template</h1>

  <VaCard>
    <VaCardTitle>Template</VaCardTitle>
    <VaCardContent>
      <VaForm ref="form" @submit.prevent="submit">
        <VaInput v-model="formData.subject" :rules="[validators.required]" class="mb-4" label="Subject" type="text" />
        <VaInput v-model="formData.body" :rules="[validators.required]" class="mb-4" label="Template" type="text" />
        <label>Plese select File: </label>

        <VaFileUpload v-model="basic" dropzone file-types="pdf,png" />
        <br />
        <div>
          <b>Activation date: </b> <b>{{ timeNow.getHours() }}:{{ timeNow.getMinutes() }}:{{ timeNow.getSeconds() }}</b>
        </div>
        <br />
        <label>Plese select date: </label>
        <VaTimePicker v-model="timeNow" ampm />

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

const timeNow = ref(new Date())
const basic = ref([])
const files = ref([])

const formData = reactive({
  subject: '',
  body: '',
})

const submit = async () => {
  if (validate()) {
    await uploadFiles()
    await addTemplate()
  }
}
const uploadFiles = async () => {
  const promises = basic.value.map((file) => {
    const formData = new FormData()
    const fileName = file.name.replace(/\s+/g, '_')
    formData.append('file', new File([file], fileName))

    return axios
      .post('http://localhost:8083/templates/uploa_file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        init({ message: response.data + ' subida con exito', color: 'success' })

        files.value.push(response.data)
      })
      .catch((error) => {
        init({ message: error.toString(), color: 'danger' })
      })
  })

  await Promise.all(promises)
}

const addTemplate = async () => {
  await axios
    .post('http://localhost:8083/templates', {
      ...formData,
      scheduledSendAt: timeNow.value.toISOString(),
      fileLinks: files.value,
    })
    .then((response) => {
      init({ message: 'Create Template Succes', color: 'success' })
    })
    .catch((error) => {
      init({ message: error.toString(), color: 'danger' })
    })
}
onMounted(async () => {
  timeNow.value = new Date()
})
</script>
