<template>
  <h1 class="page-title font-bold">Send Email</h1>
  <VaCard>
    <VaCardTitle>Recipients</VaCardTitle>
    <VaCardContent>
      <VaList>
        <VaListItem
          v-for="(contact, index) in templates"
          :key="index"
          class="list__item"
          @click="selectTemplate(contact)"
        >
          <VaListItemSection avatar>
            <VaIcon class="mr-2" name="emails" :size="44" />
          </VaListItemSection>

          <VaListItemSection>
            <VaListItemLabel>
              {{ contact.Subject }}
            </VaListItemLabel>

            <VaListItemLabel caption>
              {{ contact.Body }}
            </VaListItemLabel>
          </VaListItemSection>

          <VaListItemSection icon>
            <VaIcon name="remove_red_eye" color="background-element" />
          </VaListItemSection>
        </VaListItem>
      </VaList>
    </VaCardContent>
  </VaCard>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useToast } from 'vuestic-ui'

const { init } = useToast()

const router = useRouter()
console.log('hola asdasd')
interface Template {
  ID: string
  Body: string
}
const templates = ref<any[]>([])
const recipients = ref<any[]>([])
const selectedTemplateId = ref('')
const selectedRecipients = ref<string[]>([])
const selectedTemplate = ref(null)
const activeStep = ref(0)

const loadTemplates = async () => {
  try {
    const templatesResponse = await axios.get('http://localhost:8083/templates')
    templates.value = templatesResponse.data
    console.log(templatesResponse)
  } catch (error) {
    console.error('Error loading templates:', error)
  }
}

const loadRecipients = async () => {
  try {
    const recipientsResponse = await axios.get('http://localhost:8082/recipients')
    recipients.value = recipientsResponse.data
  } catch (error) {
    console.error('Error loading recipients:', error)
  }
}

const selectTemplate = (template: Template) => {
  console.log('template', template)

  router.push({
    path: '/send_email_step_2',
    query: { template: JSON.stringify(template) },
  })
}
const sendEmails = async () => {
  try {
    if (selectedRecipients.value.length > 0) {
      await axios.post('http://localhost:8081/send-list', {
        _id: selectedTemplateId.value,
        toList: selectedRecipients.value,
      })
    } else {
      await axios.post('http://localhost:8081/send', {
        _id: selectedTemplateId.value,
      })
    }
    init({ message: 'Mails sent successfully', color: 'success' })
  } catch (error) {
    init({ message: error.toString(), color: 'danger' })
  }
}

onMounted(async () => {
  await loadTemplates()
  await loadRecipients()
})
</script>
