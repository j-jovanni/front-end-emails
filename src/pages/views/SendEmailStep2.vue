<template>
  <h1 class="page-title font-bold">Select Optional email</h1>

  <div class="row flex gap-4">
    <div class="flex flex-col md6">
      <VaCard>
        <VaCardTitle>Title</VaCardTitle>
        <VaCardContent>
          <div class="va-table-responsive">
            <table class="va-table va-table--striped">
              <thead>
                <tr>
                  <th></th>
                  <th>Email</th>
                  <th>Id</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in recipients" :key="user.ID">
                  <td>
                    <VaCheckbox :key="user.ID" v-model="selectedRecipients" :array-value="user.Email" class="mb-6" />
                  </td>
                  <td>{{ user.Email }}</td>

                  <td>
                    <VaBadge :text="user.ID" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </VaCardContent>
      </VaCard>
    </div>
    <div class="flex flex-col md6 w-[100%]">
      <VaCard stripe stripe-color="success">
        <VaCardTitle> {{ selectedTemplate?.Subject }} </VaCardTitle>
        <VaCardContent>
          <h3>Template Details</h3>
          <p><b>ID:</b> {{ selectedTemplate?.ID }}</p>
          <p><b>From Email:</b> {{ selectedTemplate?.FromEmail }}</p>
          <p><b>Send At:</b> {{ selectedTemplate?.ScheduledSendAt }}</p>
          <p>
            <b>Body:</b> <br />
            {{ selectedTemplate?.Body }}
          </p>
        </VaCardContent>
        <VaCardActions align="between">
          <VaButton icon="clear" color="danger" to="/send_email">Cancel</VaButton>

          <VaButton icon-right="arrow_forward" icon-color="#ffffff50" @click="sendEmails(contact)">Send</VaButton>
        </VaCardActions>
      </VaCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
import { useToast } from 'vuestic-ui'
const { init } = useToast()

const route = useRoute()
interface Template {
  ID: string
  Body: string
}

//const props = defineProps<{ template: Template | null }>();
const props = defineProps<{ template: string | null }>()

const templates = ref<any[]>([])
const recipients = ref<any[]>([])
const selectedTemplateId = ref('')
const selectedRecipients = ref<string[]>([])
const selectedTemplate = ref()

const columns = [
  { key: 'ID', sortable: true, width: '60px' },
  { key: 'Email', sortable: true, width: '120px' },
]

const loadRecipients = async () => {
  try {
    const recipientsResponse = await axios.get('http://localhost:8082/recipients')
    recipients.value = recipientsResponse.data

    console.log(recipientsResponse.data)
  } catch (error) {
    console.error('Error loading recipients:', error)
  }
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
    init({ message: ' Emails enviados con exito', color: 'success' })
  } catch (error) {
    init({ message: error.toString(), color: 'danger' })
  }
}

onMounted(async () => {
  if (props.template) {
    selectedTemplate.value = JSON.parse(props.template as string)
    selectedTemplateId.value = selectedTemplate.value.ID
  }
  console.log(' selectedTemplate.value', selectedTemplate.value)

  await loadRecipients()
})
</script>
