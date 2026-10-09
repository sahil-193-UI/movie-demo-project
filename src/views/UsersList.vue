<script setup>
  import { computed, ref, onMounted } from 'vue'
  import bannerImage from '@/assets/images/page-title-bg.jpg'
  import SectionTitle from '@/components/SectionTitle/SectionTitle.vue';
  import Table from '@/components/Table/Table.vue'
  import Pagination from '@/components/Pagination/Pagination.vue'
  import { OhVueIcon, addIcons } from "oh-vue-icons";
  import { MdModeeditoutlineOutlined, MdDeleteforeverOutlined } from "oh-vue-icons/icons";
  addIcons(MdModeeditoutlineOutlined, MdDeleteforeverOutlined)
  import api from "@/services/api";

  const allUsers = ref([])
  const currentPage = ref(1)
  const pageSize = 2
  const paginatedUsers = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    return allUsers.value.slice(start, start + pageSize)
  })
  const loading = ref(true);
  const showModal = ref(false)
  const modalType = ref(null)
  const selectedUser = ref(null)

  const fetchAllUsers = async () => {
    loading.value = true;
    try {
      const response = await api.get("/auth/users");
      const users = response.data.users
      allUsers.value = users
      currentPage.value = 1
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false;
    }
  }

  const editUser = (user) => {
    selectedUser.value = {
      ...user
    }

    modalType.value = 'edit'
    showModal.value = true
  }

  const deleteUser = (user) => {
    selectedUser.value = user

    modalType.value = 'delete'
    showModal.value = true
  }

  const closeModal = () => {
    showModal.value = false
    modalType.value = null
    selectedUser.value = null
  }

  const updateUser = async () => {
    try {
      await api.put(`/auth/users/${selectedUser.value._id}`, {
        name: selectedUser.value.name,
        email: selectedUser.value.email
      });
      // Update table immediately
      const index = allUsers.value.findIndex(
        user => user._id === selectedUser.value._id
      )
      if (index !== -1) {
        allUsers.value[index] = {
          ...selectedUser.value
        }
      }
      closeModal()
    } catch (error) {
      console.error('Update failed:', error)
    }
  }

  const confirmDelete = async () => {
    try {
      await api.delete(`/auth/users/${selectedUser.value._id}`);
      allUsers.value = allUsers.value.filter(
        user => user._id !== selectedUser.value._id
      );
      currentPage.value = Math.min(
        currentPage.value,
        Math.max(1, Math.ceil(allUsers.value.length / pageSize))
      )
      closeModal();
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  onMounted(fetchAllUsers)

  const columns = [
    {
      key: '_id',
      label: 'ID'
    },
    {
      key: 'name',
      label: 'Name'
    },
    {
      key: 'email',
      label: 'Email'
    }
  ]
</script>

<template>
  <SectionTitle
    pageTitle="All Users"
    :backgroundImage="bannerImage"
  />
  <section class="users__main">
    <div class="users__main--wrap">
      <Table
        :data="paginatedUsers"
        :columns="columns"
        :loading="loading"
      >
        <!-- Actions slot -->
        <template #actions="{ row }">
          <button
            class="bg__white font__blue table__btn"
            @click="editUser(row)"
          >
            <OhVueIcon name="md-modeeditoutline-outlined" />
          </button>
          
          <button
            class="bg__blue font__white table__btn"  
            @click="deleteUser(row)"
          >
            <OhVueIcon name="md-deleteforever-outlined" />
          </button>
        </template>
      </Table>
      <Pagination
        v-if="!loading && allUsers.length > 0"
        v-model:current-page="currentPage"
        :total-items="allUsers.length"
        :page-size="pageSize"
        item-label="users"
      />
      <div
        v-if="showModal"
        class="modal__overlay"
        @click.self="closeModal"
      >
        <div class="modal">
          <!-- EDIT MODAL -->
          <template v-if="modalType === 'edit'">
            <div class="modal__header">
              <h3 class="font__weight--700 font__blue">Edit User</h3>
              <button
                class="close-btn"
                @click="closeModal"
              >
                ×
              </button>
            </div>
            <div class="modal__body">
              <div class="form-group">
                <label>Name</label>
                <input
                  v-model="selectedUser.name"
                  type="text"
                />
              </div>
              <div class="form-group">
                <label>Email</label>
                <input
                  v-model="selectedUser.email"
                  type="email"
                />
              </div>
            </div>
            <div class="modal__footer">
              <button
                class="bg__white--outline font__blue font__weight--700 text__uppercase modal__button"
                @click="closeModal"
              >
                Cancel
              </button>
              <button
                class="bg__blue font__white font__weight--700 text__uppercase modal__button"
                @click="updateUser"
              >
                Save Changes
              </button>
            </div>
          </template>
          
          <!-- DELETE MODAL -->
          <template v-if="modalType === 'delete'">
            <div class="modal__header">
              <h3 class="font__weight--700 font__blue">Delete User</h3>

              <button
                class="close-btn"
                @click="closeModal"
              >
                ×
              </button>
            </div>
            <div class="modal__body">

              <p>
                Are you sure you want to delete
                <strong>
                  {{ selectedUser?.name }}
                </strong>
                ?
              </p>

              <p>
                This action cannot be undone.
              </p>

            </div>
            <div class="modal__footer">

              <button
                class="bg__white--outline font__blue font__weight--700 text__uppercase modal__button"
                @click="closeModal"
              >
                Cancel
              </button>

              <button
                class="bg__blue font__white font__weight--700 text__uppercase modal__button"
                @click="confirmDelete"
              >
                Yes, Delete
              </button>

            </div>
          </template>
        </div>
      </div>
    </div>
  </section>  
</template>
