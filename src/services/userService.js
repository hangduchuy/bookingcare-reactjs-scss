import axios from '../axios'

const handleLoginApi = (userEmail, userPassword) => {
    return axios.post('/api/login', { email: userEmail, password: userPassword })
}

const getAllUsers = (inputId) => {
    return axios.get(`/api/get-all-users?id=${inputId}`)
}

const createNewUserService = (data) => {
    return axios.post(`/api/create-new-user`, data)
}

const deleteUserService = (userId) => {
    // return axios.delete(`/api/delete-user`, { id: userId })
    return axios.delete(`/api/delete-user`, {
        data: {
            id: userId
        }
    })
}

const editUserService = (inputdata) => {
    // return axios.delete(`/api/delete-user`, { id: userId })
    return axios.put(`/api/edit-user`, inputdata)
}

const getAllCodeService = (inputType) => {
    return axios.get(`/api/allcode?type=${inputType}`)
}

const getTopDoctorHomeService = (limit) => {
    return axios.get(`/api/top-doctor-home?limit=${limit}`)
}

const getAllDoctors = () => {
    return axios.get(`/api/get-all-doctors`)
}

const saveDetailDoctor = (data) => {
    return axios.post(`/api/save-infor-doctors`, data)
}

const getDetailInforDoctor = (inputId) => {
    return axios.get(`/api/get-detail-doctor-by-id?id=${inputId}`)
}

const saveBulkScheduleDoctor = (data) => {
    return axios.post(`/api/bulk-create-schedule`, data)
}

const getScheduleDoctorByDate = (doctorId, date) => {
    return axios.get(`/api/get-schedule-doctor-by-date?doctorId=${doctorId}&date=${date}`)
}
const saveDoctorRequest = async (id, data) => {
    return axios.post('/api/save-doctor-request', { id, data })
}
const postToHistories = async (data) => {
    return axios.post('/api/post-histories', data)
}
const getExtraInforDoctorById = (doctorId) => {
    return axios.get(`/api/get-extra-infor-doctor-by-id?doctorId=${doctorId}`)
}

const getProfileDoctorById = (doctorId) => {
    return axios.get(`/api/get-profile-doctor-by-id?doctorId=${doctorId}`)
}

const postPatientBookAppointment = (data) => {
    return axios.post(`/api/patient-book-appointment`, data)
}

const postVerifyBookAppointment = (data) => {
    return axios.post(`/api/verify-book-appointment`, data)
}

const createNewSpecialty = (data) => {
    return axios.post(`/api/create-new-specialty`, data)
}

const getAllSpecialty = () => {
    // Thực hiện cuộc gọi API sử dụng Axios
    return axios
        .get('/api/get-specialty')
        .then((response) => {
            return response // Trả về đối tượng phản hồi từ Axios
        })
        .catch((error) => {
            throw error // Xử lý lỗi nếu có
        })
}
const getAllClinic = () => {
    return axios.get(`/api/get-clinic`)
}

const getDetailSpecialtyById = (data) => {
    return axios.get(`/api/get-detail-specialty-by-id?id=${data.id}&location=${data.location}`)
}

const createNewClinic = (data) => {
    return axios.post(`/api/create-new-clinic`, data)
}

const getDetailClinicById = (data) => {
    return axios.get(`/api/get-detail-clinic-by-id?id=${data.id}`)
}
const getListPatient = (data) => {
    return axios.get(`/api/get-list-patient?date=${data.date}`)
}
const getListPatientToCheck = (data) => {
    return axios.get(`/api/get-list-patient-to-check?date=${data.date}`)
}

const showCheckRequest = (data) => {
    return axios.get(`/api/show-doctor-request?patientId=${data.patientId}`)
}
const getAllPatientForDoctor = (data) => {
    return axios.get(`/api/get-list-patient-for-doctor?doctorId=${data.doctorId}&date=${data.date}`)
}

const postSendRemedy = (data) => {
    return axios.post(`/api/send-remedy`, data)
}
const TSPT3 = (data) => {
    return axios.post(`/api/TSPT3`, data)
}
const TSPT4 = (data) => {
    return axios.post(`/api/TSPT4`, data)
}
const UpdatePatient_Info = (data) => {
    return axios.post(`/api/update-patient-info`, data)
}
const postSendComment = (data) => {
    return axios.post(`/api/send-comment`, data)
}

const getListCommentForPatient = (data) => {
    return axios.get(`/api/get-list-comment-for-patient?doctorId=${data.doctorId}`)
}
const createNewHandbook = (data) => {
    return axios.post(`/api/create-new-handbook`, data)
}
const getAllHandbook = () => {
    return axios.get(`/api/get-handbooks`)
}
const getDetailHandbookById = (data) => {
    return axios.get(`/api/get-detail-handbook-by-id?id=${data.id}`)
}
const search = (data) => {
    return axios.get(`/api/search?name=${data}`)
}

const totalMoney = () => {
    return axios.get(`/api/total-money`)
}
const dataForBarChart = () => {
    return axios.get(`/api/get-barchart`)
}

const getClinicDoctorById = (data) => {
    return axios.get(`/api/get-clinic-doctor-by-id?doctorId=${data.doctorId}`)
}

const getPaymentConfig = () => {
    return axios.get(`/api/payment/config`)
}

const totalCustomer = () => {
    return axios.get(`/api/get-All-Customer `)
}

const getDetailPatientById = (patientId) => {
    return axios.get(`/api/get-detail-patient-by-id?patientId=${patientId}`)
}
const backDataAfterSendRemedy = (patientId, doctorId) => {
    return axios.get(`/api/back-data-after-send-remedy?patientId=${patientId}&doctorId=${doctorId}`)
}

const UpdateDetailPatient = (data) => {
    return axios.post(`/api/edit-detail-patient`, data)
}

const getAllSchedules = () => {
    return axios.get(`/api/get-All-Schedules`)
}

const getMostSpecialized = () => {
    return axios.get(`/api/get-most-specialized`)
}

export {
    handleLoginApi,
    getAllUsers,
    createNewUserService,
    deleteUserService,
    editUserService,
    getAllCodeService,
    getTopDoctorHomeService,
    getAllDoctors,
    saveDetailDoctor,
    getDetailInforDoctor,
    saveBulkScheduleDoctor,
    getScheduleDoctorByDate,
    getExtraInforDoctorById,
    getProfileDoctorById,
    postPatientBookAppointment,
    postVerifyBookAppointment,
    createNewSpecialty,
    getAllSpecialty,
    getDetailSpecialtyById,
    createNewClinic,
    getAllClinic,
    getDetailClinicById,
    getAllPatientForDoctor,
    postSendRemedy,
    postSendComment,
    getListCommentForPatient,
    createNewHandbook,
    getAllHandbook,
    getDetailHandbookById,
    search,
    totalMoney,
    dataForBarChart,
    getClinicDoctorById,
    getPaymentConfig,
    totalCustomer,
    getDetailPatientById,
    UpdateDetailPatient,
    getAllSchedules,
    getListPatient,
    TSPT3,
    TSPT4,
    UpdatePatient_Info,
    getListPatientToCheck,
    showCheckRequest,
    saveDoctorRequest,
    backDataAfterSendRemedy,
    postToHistories,
    getMostSpecialized
}
