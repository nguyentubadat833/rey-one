<script setup lang="ts">
const activeTab = ref('0')

const tabItems = [
  { label: 'Cấu hình chung', icon: 'i-heroicons-cog-6-tooth', slot: 'general' },
  { label: 'Bảo mật & SSO', icon: 'i-heroicons-shield-check', slot: 'security' },
  { label: 'Cấu hình SMTP Mail', icon: 'i-heroicons-envelope', slot: 'smtp' },
  { label: 'Quản lý API Keys', icon: 'i-heroicons-key', slot: 'apikeys' },
  { label: 'Webhooks Integration', icon: 'i-heroicons-link', slot: 'webhooks' }
]

// 1. General State
const generalState = reactive({
  timezone: 'Asia/Ho_Chi_Minh',
  dateFormat: 'DD/MM/YYYY',
  language: 'vi',
  maintenanceMode: false
})

// 2. Security State
const securityState = reactive({
  twoFactorRequired: true,
  sessionTimeout: '60',
  maxFailedLogins: '5',
  ipWhitelist: '192.168.1.1/24, 10.0.0.1'
})

// 3. SMTP State
const smtpState = reactive({
  host: 'smtp.gmail.com',
  port: 587,
  username: 'no-reply@company.com',
  password: '••••••••••••••••',
  encryption: 'TLS',
  fromName: 'RONE System Alert'
})

// 4. Fake Data: API Keys Table (10+ records)
const apiKeyColumns = [
  { accessorKey: 'name', header: 'Tên Key' },
  { accessorKey: 'prefix', header: 'Key Prefix' },
  { accessorKey: 'createdAt', header: 'Ngày tạo' },
  { accessorKey: 'lastUsed', header: 'Truy cập cuối' },
  { accessorKey: 'status', header: 'Trạng thái' },
  { accessorKey: 'actions', header: '' }
]

const apiKeys = ref(
  Array.from({ length: 12 }, (_, i) => ({
    id: `KEY-${100 + i}`,
    name: `API Service Integration ${i + 1}`,
    prefix: `rn_live_k${i}x9...8f2a`,
    createdAt: new Date(2026, 0, 10 - i).toLocaleDateString('vi-VN'),
    lastUsed: i % 3 === 0 ? 'Chưa sử dụng' : `${i * 2} giờ trước`,
    status: i % 4 === 0 ? 'Revoked' : 'Active'
  }))
)

// 5. Fake Data: Webhooks Table (10+ records)
const webhookColumns = [
  { accessorKey: 'url', header: 'Endpoint URL' },
  { accessorKey: 'events', header: 'Sự kiện' },
  { accessorKey: 'createdAt', header: 'Ngày tạo' },
  { accessorKey: 'status', header: 'Trạng thái' },
  { accessorKey: 'actions', header: '' }
]

const webhooks = ref(
  Array.from({ length: 10 }, (_, i) => ({
    id: `WH-${500 + i}`,
    url: `https://api.partner-service-${i + 1}.io/v1/webhook`,
    events: i % 2 === 0 ? 'user.created, order.paid' : 'billing.invoice_created',
    createdAt: new Date(2026, 1, 1 - i).toLocaleDateString('vi-VN'),
    status: i % 3 === 0 ? 'Disabled' : 'Enabled'
  }))
)
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Cấu hình Hệ thống</h1>
        <p class="text-sm text-gray-500">Quản lý các thiết lập vận hành, an ninh và tích hợp của Tenant.</p>
      </div>
    </div>

    <!-- Main Setting Tabs -->
    <UTabs :items="tabItems" class="w-full">
      <!-- 1. TAB CẤU HÌNH CHUNG -->
      <template #general>
        <UCard class="mt-4 max-w-3xl">
          <form class="space-y-6" @submit.prevent>
            <UFormField label="Múi giờ hệ thống" description="Múi giờ dùng để hiển thị toàn bộ Log và Báo cáo">
              <USelect
                v-model="generalState.timezone"
                :items="['Asia/Ho_Chi_Minh', 'UTC', 'America/New_York', 'Europe/London']"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Định dạng ngày tháng">
              <USelect
                v-model="generalState.dateFormat"
                :items="['DD/MM/YYYY', 'YYYY-MM-DD', 'MM/DD/YYYY']"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Ngôn ngữ mặc định">
              <USelect
                v-model="generalState.language"
                :items="[
                  { label: 'Tiếng Việt', value: 'vi' },
                  { label: 'English', value: 'en' }
                ]"
                class="w-full"
              />
            </UFormField>

            <USeparator />

            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-sm">Bật chế độ bảo trì (Maintenance Mode)</p>
                <p class="text-xs text-gray-500">Tạm dừng truy cập ứng dụng đối với người dùng thông thường</p>
              </div>
              <USwitch v-model="generalState.maintenanceMode" />
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <UButton color="primary">Lưu thay đổi</UButton>
            </div>
          </form>
        </UCard>
      </template>

      <!-- 2. TAB BẢO MẬT & SSO -->
      <template #security>
        <UCard class="mt-4 max-w-3xl space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium text-sm">Bắt buộc xác thực 2 lớp (2FA)</p>
              <p class="text-xs text-gray-500">Áp dụng cho toàn bộ tài khoản Admin trong Tenant</p>
            </div>
            <USwitch v-model="securityState.twoFactorRequired" />
          </div>

          <USeparator />

          <UFormField label="Thời gian chờ hết phiên làm việc (Phút)">
            <UInput v-model="securityState.sessionTimeout" type="number" class="w-full" />
          </UFormField>

          <UFormField label="Số lần đăng nhập sai tối đa" description="Khóa tài khoản tạm thời khi vượt quá hạn mức">
            <UInput v-model="securityState.maxFailedLogins" type="number" class="w-full" />
          </UFormField>

          <UFormField label="IP Whitelist" description="Chỉ cho phép truy cập Admin từ các dải IP này (phân cách bằng dấu phẩy)">
            <UTextarea v-model="securityState.ipWhitelist" placeholder="192.168.1.1, 10.0.0.1/24" class="w-full" />
          </UFormField>

          <div class="flex justify-end gap-3 pt-4">
            <UButton color="primary">Cập nhật chính sách bảo mật</UButton>
          </div>
        </UCard>
      </template>

      <!-- 3. TAB CONFIG SMTP -->
      <template #smtp>
        <UCard class="mt-4 max-w-3xl">
          <form class="space-y-6" @submit.prevent>
            <div class="grid grid-cols-3 gap-4">
              <UFormField label="SMTP Host" class="col-span-2">
                <UInput v-model="smtpState.host" class="w-full" />
              </UFormField>
              <UFormField label="Port">
                <UInput v-model.number="smtpState.port" type="number" class="w-full" />
              </UFormField>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <UFormField label="Username / Email">
                <UInput v-model="smtpState.username" class="w-full" />
              </UFormField>
              <UFormField label="Password / App Secret">
                <UInput v-model="smtpState.password" type="password" class="w-full" />
              </UFormField>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <UFormField label="Mã hóa">
                <USelect v-model="smtpState.encryption" :items="['TLS', 'SSL', 'NONE']" class="w-full" />
              </UFormField>
              <UFormField label="Tên người gửi (From Name)">
                <UInput v-model="smtpState.fromName" class="w-full" />
              </UFormField>
            </div>

            <USeparator />

            <div class="flex justify-between items-center pt-2">
              <UButton color="neutral" variant="outline" icon="i-heroicons-paper-airplane">
                Gửi mail thử nghiệm
              </UButton>
              <UButton color="primary">Lưu cấu hình SMTP</UButton>
            </div>
          </form>
        </UCard>
      </template>

      <!-- 4. TAB QUẢN LÝ API KEYS -->
      <template #apikeys>
        <UCard class="mt-4">
          <template #header>
            <div class="flex items-center justify-between">
              <div>
                <span class="font-semibold text-sm">Danh sách API Keys</span>
                <p class="text-xs text-gray-500">Dùng để truy cập REST API hệ thống từ ứng dụng bên ngoài</p>
              </div>
              <UButton icon="i-heroicons-plus" color="primary" size="xs">
                Tạo Key mới
              </UButton>
            </div>
          </template>

          <UTable :data="apiKeys" :columns="apiKeyColumns">
            <template #prefix-cell="{ row }">
              <span class="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                {{ row.original.prefix }}
              </span>
            </template>

            <template #status-cell="{ row }">
              <UBadge
                :color="row.original.status === 'Active' ? 'success' : 'error'"
                variant="subtle"
                size="xs"
              >
                {{ row.original.status }}
              </UBadge>
            </template>

            <template #actions-cell="{ row }">
              <UButton
                icon="i-heroicons-trash"
                color="error"
                variant="ghost"
                size="xs"
                :disabled="row.original.status === 'Revoked'"
              />
            </template>
          </UTable>
        </UCard>
      </template>

      <!-- 5. TAB WEBHOOKS -->
      <template #webhooks>
        <UCard class="mt-4">
          <template #header>
            <div class="flex items-center justify-between">
              <div>
                <span class="font-semibold text-sm">Webhook Endpoints</span>
                <p class="text-xs text-gray-500">Đẩy thông báo sự kiện realtime sang server thứ 3</p>
              </div>
              <UButton icon="i-heroicons-plus" color="primary" size="xs">
                Thêm Webhook
              </UButton>
            </div>
          </template>

          <UTable :data="webhooks" :columns="webhookColumns">
            <template #url-cell="{ row }">
              <span class="font-mono text-xs font-semibold text-primary-600 dark:text-primary-400">
                {{ row.original.url }}
              </span>
            </template>

            <template #status-cell="{ row }">
              <UBadge
                :color="row.original.status === 'Enabled' ? 'success' : 'neutral'"
                variant="subtle"
                size="xs"
              >
                {{ row.original.status }}
              </UBadge>
            </template>

            <template #actions-cell>
              <div class="flex gap-1">
                <UButton icon="i-heroicons-pencil-square" color="neutral" variant="ghost" size="xs" />
                <UButton icon="i-heroicons-trash" color="error" variant="ghost" size="xs" />
              </div>
            </template>
          </UTable>
        </UCard>
      </template>
    </UTabs>
  </div>
</template>