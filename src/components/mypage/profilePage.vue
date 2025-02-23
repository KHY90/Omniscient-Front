<template>
  <div class="profile-page">
    <h1 class="profile-title">프로필</h1>
    <form @submit.prevent="showConfirmModal" class="profile-form">
      <div class="profile-content">
        <div class="profile-left">
          <div class="profile-main">
            <div class="profile-image">
              <img
                :src="previewImage || profileImageUrl"
                alt="프로필 이미지"
                @click="triggerImageUpload"
              />
              <input
                type="file"
                ref="imageInput"
                @change="handleImageUpload"
                style="display: none"
                accept="image/*"
                id="profileImage"
                multiple
              />
              <label
                for="profileImage"
                v-if="isEditing"
                class="image-upload-prompt"
              >
                <i class="fas fa-camera"></i>
                <span>이미지 변경 (최대 5MB)</span>
              </label>
            </div>

            <div class="profile-details">
              <div class="profile-header" v-if="!isEditing">
                <h2>{{ profile.profileName }}</h2>
                <p class="job-title">{{ profile.profilePosition }}</p>
              </div>
              <div v-else>
                <div class="form-group">
                  <label for="name">이름</label>
                  <input
                    id="name"
                    v-model="profile.profileName"
                    type="text"
                    class="edit-input"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="jobTitle">직책</label>
                  <input
                    id="jobTitle"
                    v-model="profile.profilePosition"
                    type="text"
                    class="edit-input"
                  />
                </div>
              </div>

              <div class="contact-info">
                <div v-if="!isEditing">
                  <p>
                    <i class="fas fa-envelope" style="color: #2196f3"></i>
                    <span>{{ profile.profileEmail }}</span>
                  </p>
                  <p>
                    <i class="fas fa-phone" style="color: #4caf50"></i>
                    <span>{{ profile.profilePhone }}</span>
                  </p>
                </div>
                <div v-else>
                  <div class="form-group">
                    <label for="email">이메일</label>
                    <input
                      id="email"
                      v-model="profile.profileEmail"
                      type="email"
                      class="edit-input"
                      placeholder="이메일"
                      required
                    />
                  </div>
                  <div class="form-group">
                    <label for="phone">전화번호</label>
                    <input
                      id="phone"
                      v-model="profile.profilePhone"
                      type="tel"
                      class="edit-input"
                      placeholder="전화번호"
                    />
                  </div>
                </div>
              </div>

              <div class="additional-info">
                <div v-if="!isEditing">
                  <p>
                    <i class="fas fa-map-marker-alt" style="color: #e91e63"></i>
                    <span>{{ profile.profileAddress }}</span>
                  </p>
                </div>
                <div v-else>
                  <div class="form-group">
                    <label for="address">주소</label>
                    <input
                      id="address"
                      v-model="profile.profileAddress"
                      type="text"
                      class="edit-input"
                      placeholder="주소"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="button-container">
            <button
              type="submit"
              v-if="isEditing"
              class="edit-button save-mode"
            >
              <i class="fas fa-save"></i> 저장
            </button>
            <button
              type="button"
              @click="toggleEditMode"
              v-else
              class="edit-button"
            >
              <i class="fas fa-edit"></i> 수정
            </button>
          </div>
        </div>

        <div class="profile-right">
          <!-- 추가 내용 -->
        </div>
      </div>
    </form>

    <div v-if="showSaveModal" class="modal-overlay" @click="closeSaveModal">
      <div class="modal-content" @click.stop>
        <h3><i class="fas fa-question-circle"></i> 확인</h3>
        <p>프로필을 저장하시겠습니까?</p>
        <div class="modal-actions">
          <button @click="confirmSave" class="confirm-button">
            <i class="fas fa-check"></i> 예
          </button>
          <button @click="closeSaveModal" class="cancel-button">
            <i class="fas fa-times"></i> 아니오
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showDeactivateModal"
      class="modal-overlay"
      @click="closeDeactivateModal"
    >
      <div class="modal-content" @click.stop>
        <h3><i class="fas fa-exclamation-triangle"></i> 경고</h3>
        <p>
          정말로 이 프로필을 비활성화하시겠습니까? 이 작업은 되돌릴 수 없습니다.
        </p>
        <div class="modal-actions">
          <button @click="confirmDeactivate" class="confirm-button">
            <i class="fas fa-check"></i> 예, 비활성화합니다
          </button>
          <button @click="closeDeactivateModal" class="cancel-button">
            <i class="fas fa-times"></i> 아니오, 취소합니다
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const PROFILE_API_URL = `${API_BASE_URL}/api/v1/profile`;
// const FILE_UPLOAD_URL = `${API_BASE_URL}/api/v1/files/upload`;

const profile = reactive({
  id: null,
  profileName: "",
  profilePosition: "",
  profileEmail: "",
  profilePhone: "",
  profileAge: null,
  profileAddress: "",
  profileactive: true,
  profileimageFileName: null,
});

const isEditing = ref(false);
const imageInput = ref(null);
const previewImage = ref(null);
const showSaveModal = ref(false);
const showDeactivateModal = ref(false);
const isLoading = ref(false);

const profileImageUrl = computed(() => {
  if (previewImage.value) {
    return previewImage.value;
  } else if (profile.profileimageFileName) {
    return `${PROFILE_API_URL}/${profile.id}/image?${new Date().getTime()}`; // 캐시 방지
  } else {
    return "https://via.placeholder.com/150";
  }
});

const loadProfile = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(PROFILE_API_URL);
    if (response.data && response.data.length > 0) {
      Object.assign(profile, response.data[0]);
    }
  } catch (error) {
    console.error("프로필을 불러오는데 실패했습니다:", error);
    alert("프로필을 불러오는데 실패했습니다.");
  } finally {
    isLoading.value = false;
  }
};

const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/files/upload`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return response.data.imageFileName || response.data.fileName;
  } catch (error) {
    console.error("이미지 업로드 실패:", error);
    throw error;
  }
};
const toggleEditMode = () => {
  isEditing.value = !isEditing.value;
};

const addCertificate = () => {
  profile.certificates.push("");
};

const removeCertificate = (index) => {
  profile.certificates.splice(index, 1);
};

const triggerImageUpload = () => {
  if (isEditing.value) {
    imageInput.value.click();
  }
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const showConfirmModal = () => {
  showSaveModal.value = true;
};

const closeSaveModal = () => {
  showSaveModal.value = false;
};

const confirmSave = async () => {
  isLoading.value = true;
  try {
    let updatedProfile = { ...profile };

    if (previewImage.value) {
      const file = await fetch(previewImage.value).then((r) => r.blob());
      const fileName = await uploadImage(
        new File([file], "profile_image.jpg", { type: "image/jpeg" })
      );

      if (fileName) {
        updatedProfile.profileimageFileName = fileName;
      }
    }

    let response;
    if (profile.id) {
      response = await axios.put(
        `${PROFILE_API_URL}/update/${profile.id}`,
        updatedProfile
      );
    } else {
      response = await axios.post(PROFILE_API_URL, updatedProfile);
    }

    Object.assign(profile, response.data);
    alert("프로필이 성공적으로 저장되었습니다.");
  } catch (error) {
    console.error("프로필 저장 중 오류 발생:", error);
    alert(`프로필 저장에 실패했습니다: ${error.message}`);
  } finally {
    isLoading.value = false;
    isEditing.value = false;
    showSaveModal.value = false;
    previewImage.value = null;
  }
};

const saveProfile = async () => {
  isLoading.value = true;
  console.log("프로필 저장 시작"); // 추가된 로그
  try {
    let updatedProfile = { ...profile };

    if (previewImage.value && previewImage.value !== profileImageUrl.value) {
      console.log("새 이미지 감지됨, 업로드 시작..."); // 추가된 로그
      const file = await fetch(previewImage.value).then((r) => r.blob());
      console.log("파일 준비됨:", file.size, "bytes"); // 추가된 로그

      // 파일 업로드
      const fileName = await uploadImage(
        new File([file], "profile_image.jpg", { type: "image/jpeg" })
      );
      console.log("이미지 업로드 완료, 파일명:", fileName); // 변경 없음

      // fileName이 유효한 경우에만 updatedProfile을 업데이트
      if (fileName) {
        updatedProfile.imageFileName = fileName;
      } else {
        console.warn("업로드된 이미지 파일 이름이 없습니다.");
      }
    }

    // 업데이트할 프로필 상태 출력
    console.log("업데이트할 프로필:", updatedProfile); // 추가된 로그

    console.log("프로필 저장 시작:", updatedProfile); // 추가된 로그
    let response;
    if (profile.id) {
      response = await axios.put(
        `${PROFILE_API_URL}/${profile.id}`,
        updatedProfile
      );
    } else {
      response = await axios.post(PROFILE_API_URL, updatedProfile);
    }
    console.log("서버 응답:", response.data); // 추가된 로그

    Object.assign(profile, response.data);
    console.log("프로필 업데이트 완료:", profile); // 추가된 로그

    isEditing.value = false;
    showSaveModal.value = false;
    previewImage.value = null;
    alert("프로필이 성공적으로 저장되었습니다.");
  } catch (error) {
    console.error("프로필 저장 중 오류 발생:", error);
    alert(`프로필 저장에 실패했습니다: ${error.message}`);
  } finally {
    isLoading.value = false;
  }
};

const showDeactivateConfirmation = () => {
  showDeactivateModal.value = true;
};

const closeDeactivateModal = () => {
  showDeactivateModal.value = false;
};

const confirmDeactivate = async () => {
  isLoading.value = true;
  try {
    await axios.put(`${PROFILE_API_URL}/status/${profile.id}`);
    showDeactivateModal.value = false;
    alert("프로필이 성공적으로 비활성화되었습니다.");
  } catch (error) {
    console.error("프로필 비활성화에 실패했습니다:", error);
    alert("프로필 비활성화에 실패했습니다.");
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadProfile();
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap");
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css");

.profile-page {
  padding: 20px;
  max-width: 1400px;
}

.profile-title {
  font-size: 36px;
  margin-bottom: 30px;
  text-align: center;
}

.profile-content {
  width: 100%; /* 전체 너비 사용 */
  max-width: 800px; /* 최대 너비 설정 */
  margin: 0 auto; /* 중앙 정렬 */
  padding: 20px; /* 내부 여백 */
  border-radius: 8px; /* 모서리 둥글게 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 그림자 추가 */
}

.profile-section {
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.basic-info {
  height: 100%;
}

.section-title {
  font-size: 28px;
  color: #007bff;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #007bff;
}

.profile-main {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-image {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 30px;
  position: relative;
  cursor: pointer;
}

.profile-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-upload-prompt {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  text-align: center;
  padding: 8px;
  font-size: 16px;
}

.profile-details {
  display: flex;
  flex-direction: column;
  justify-content: center; /* 수직 정렬 */
  align-items: flex-start; /* 좌측 정렬 */
  padding: 10px;
  border: 1px solid #ddd; /* 박스 테두리 */
  border-radius: 8px;
  width: 100%; /* 전체 너비 사용 */
  max-width: 300px; /* 최대 너비 설정 */
  min-height: 250px; /* 최소 높이 설정 */
  background-color: #f9f9f9; /* 배경 색상 */
}

.profile-details h2 {
  font-size: 32px;
  margin-bottom: 10px;
}

.job-title {
  font-size: 22px;
  color: #666;
  margin-bottom: 20px;
}

.contact-info p {
  font-size: 18px;
  margin: 10px 0;
}

.contact-info i {
  margin-right: 15px;
  color: #007bff;
}

.edit-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.button-container {
  margin-top: auto; /* 위쪽 공간을 모두 차지하고 버튼을 아래로 이동 */
  margin-left: 20px; /* 왼쪽 여백 */
  margin-bottom: 20px; /* 아래 여백 */
}

.edit-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 30px;
  cursor: pointer;
  font-size: 18px;
  display: inline-flex;
  align-items: center;
  transition: background-color 0.3s, transform 0.3s;
}

.edit-button:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

.edit-button.save-mode {
  background-color: #28a745;
}

.edit-button i {
  margin-right: 10px;
}

/* 모달 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 90%;
  text-align: center;
}

.modal-content h3 {
  color: #007bff;
  font-size: 24px;
  margin-bottom: 20px;
}

.modal-content p {
  font-size: 18px;
  margin-bottom: 30px;
  color: #333;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.confirm-button,
.cancel-button {
  padding: 10px 20px;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.confirm-button {
  background-color: #28a745;
  color: white;
}

.confirm-button:hover {
  background-color: #218838;
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.cancel-button {
  background-color: #dc3545;
  color: white;
}

.cancel-button:hover {
  background-color: #c82333;
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

/* 애니메이션 효과 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-content {
  animation: fadeIn 0.3s ease-out;
}

@media (max-width: 1024px) {
  .profile-content {
    flex-direction: column;
  }

  .button-container {
    text-align: center;
  }
}

@media (max-width: 768px) {
  .profile-section {
    padding: 20px;
  }

  .section-title {
    font-size: 24px;
  }

  .profile-details h2 {
    font-size: 28px;
  }

  .job-title {
    font-size: 20px;
  }

  .edit-button {
    width: 100%;
    justify-content: center;
  }
}
</style>
