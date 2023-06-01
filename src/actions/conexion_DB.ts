import { Student } from '../interfaces/students'
import { TOKEN, API_URL } from '../constants/credentials'

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${TOKEN}`
}

export const getStudents = () => {
  const apiData: any = fetch(`${API_URL}/estudiantes`, {
    method: 'GET',
    headers: headers
  }).then((response) => {
    return response.json()
  }).then((data) => {
    return data
  }).catch((error) => {
    return error
  })
  return apiData
}

export const saveStudent = (student: Student) => {
  const apiData: any = fetch(`${API_URL}/estudiantes`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(student)
  }).then((response) => {
    return response.json()
  }).then((data) => {
    return data
  }).catch((error) => {
    return error
  })
  return apiData
}

export const updateStudent = (student: Student, id: string) => {
  const apiData: any = fetch(`${API_URL}/estudiantes/${id}`, {
    method: 'PUT',
    headers: headers,
    body: JSON.stringify(student)
  }).then((response) => {
    return response.json()
  }).then((data) => {
    return data
  }).catch((error) => {
    return error
  })
  return apiData
}

export const updateState = (id: string, state: string) => {
  const apiData: any = fetch(`${API_URL}/estudiantes/estado/${id}`, {
    method: 'PUT',
    headers: headers,
    body: JSON.stringify({ estado: state })
  }).then((response) => {
    return response.json()
  }).then((data) => {
    return data
  }).catch((error) => {
    return error
  })
  return apiData
}