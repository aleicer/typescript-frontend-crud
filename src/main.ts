import Toastify from "toastify-js"
import "toastify-js/src/toastify.css"
import { getStudents, saveStudent, updateStudent, updateState } from './actions/conexion_DB.ts'
import { Student, ApiStudent } from './interfaces/students.ts'

const students = await getStudents()
const studentForm = document.querySelector<HTMLFormElement>('#studentForm')
const studentList = document.querySelector<HTMLFormElement>('#studentList')
renderStudents(students.data)

studentForm?.addEventListener('submit', async (e) => {
  e.preventDefault()
  const firstName = studentForm['firstName'] as unknown as HTMLInputElement
  const lastName = studentForm['lastName'] as unknown as HTMLInputElement
  const typeGovId = studentForm['typeGovId'] as unknown as HTMLSelectElement
  const govId = studentForm['govId'] as unknown as HTMLInputElement
  const phone = studentForm['phone'] as unknown as HTMLInputElement
  const email = studentForm['email'] as unknown as HTMLInputElement
  const linkedin = studentForm['linkedin'] as unknown as HTMLInputElement
  const github = studentForm['github'] as unknown as HTMLInputElement
  const newStudent: Student = {
    tipoIdentificacion: Number(typeGovId.value),
    numeroIdentificacion: Number(govId.value),
    nombres: firstName.value,
    apellidos: lastName.value,
    celular: Number(phone.value),
    correo: email.value,
    linkedin: linkedin.value,
    github: github.value
  }
  const saveNewStudent = await saveStudent(newStudent)
  if (saveNewStudent.status === 400) {
    Toastify({
      text: 'Error al crear estudiante',
    }).showToast();
  } else {
    const students = await getStudents()
    const studentSave: ApiStudent = students.data.find((s: ApiStudent) => s.estudiante_id === saveNewStudent.id)
    const rowElement = document.createElement('tr')
    const estado = document.createElement('td')
    estado.innerText = studentSave.estudiante_estado
    rowElement.append(estado)
    const nombres = document.createElement('td')
    nombres.innerText = studentSave.estudiante_nombres
    rowElement.append(nombres)
    const apellidos = document.createElement('td')
    apellidos.innerText = studentSave.estudiante_apellidos
    rowElement.append(apellidos)
    const celular = document.createElement('td')
    celular.innerText = studentSave.estudiante_celular
    rowElement.append(celular)
    const correo = document.createElement('td')
    correo.innerText = studentSave.estudiante_correo
    rowElement.append(correo)
    studentList?.appendChild(rowElement)

    Toastify({
      text: "Estudiante creado correctamente",
    }).showToast()
    studentForm?.reset()
  }
})

function renderStudentModal (student: ApiStudent) {
  document.querySelector<HTMLInputElement>('#updateFirstName')!.value = student.estudiante_nombres
  document.querySelector<HTMLInputElement>('#updateLastName')!.value = student.estudiante_apellidos
  document.querySelector<HTMLInputElement>('#updatePhone')!.value = student.estudiante_celular
  document.querySelector<HTMLInputElement>('#updateEmail')!.value = student.estudiante_correo
  document.querySelector<HTMLInputElement>('#updateLinkedin')!.value = student.estudiante_linkedin
  document.querySelector<HTMLInputElement>('#updateGithub')!.value = student.estudiante_github
  document.querySelector<HTMLInputElement>('#btnUpdate')!.onclick = () => updateStudentById(student.estudiante_id.toString())

}

async function updateStudentById (id: string) {
  const name: string = document.querySelector<HTMLInputElement>('#updateFirstName')!.value
  const lastName: string = document.querySelector<HTMLInputElement>('#updateLastName')!.value
  const phone: string = document.querySelector<HTMLInputElement>('#updatePhone')!.value
  const email: string = document.querySelector<HTMLInputElement>('#updateEmail')!.value
  const linkedin: string = document.querySelector<HTMLInputElement>('#updateLinkedin')!.value
  const github: string = document.querySelector<HTMLInputElement>('#updateGithub')!.value
  const student: Student = {
    nombres: name,
    apellidos: lastName,
    celular: Number(phone),
    correo: email,
    linkedin: linkedin,
    github: github,
  }

  const update = await updateStudent(student, id)
  if (update.data) {
    Toastify({
      text: "Estudiante actualizado.",
    }).showToast()
  } else { 
    Toastify({
      backgroundColor: "red",
      text: "Algo ocurrio al actualizar",
    }).showToast()
  }
  document.querySelector<HTMLInputElement>('#modalUpdate')?.click()
  studentList?.replaceChildren()
  const students = await getStudents()
  renderStudents(students.data)
}

async function updateState(id: string, state: string) {
  console.log(id, state)
  const newState: string = state === 'activo' ? 'inactivo' : 'activo' 
  const update: any = await updateState(id, newState)
  if (update.data) {
    Toastify({
      text: "Estado actualizado.",
    }).showToast()
  } else { 
    Toastify({
      backgroundColor: "red",
      text: "Algo ocurrio al actualizar",
    }).showToast()
  }
  studentList?.replaceChildren()
  const students = await getStudents()
  renderStudents(students.data)
} 


function renderStudents (students: ApiStudent[]) {
  students.forEach((student) => {
    const rowElement = document.createElement('tr')
    const estado = document.createElement('td')
    estado.innerText = student.estudiante_estado
    estado.style.background = student.estudiante_estado === 'activo' ? '#317305' : '#b54a03'
    rowElement.append(estado)
    const nombres = document.createElement('td')
    nombres.innerText = student.estudiante_nombres
    rowElement.append(nombres)
    const apellidos = document.createElement('td')
    apellidos.innerText = student.estudiante_apellidos
    rowElement.append(apellidos)
    const celular = document.createElement('td')
    celular.innerText = student.estudiante_celular
    rowElement.append(celular)
    const correo = document.createElement('td')
    correo.innerText = student.estudiante_correo
    rowElement.append(correo)
    const btnUpdate = document.createElement('button')
    btnUpdate.innerText = 'Actualizar'
    btnUpdate.onclick = () => renderStudentModal(student)
    btnUpdate.setAttribute('data-bs-toggle', 'modal')
    btnUpdate.setAttribute('data-bs-target', '#modalUpdate')
    btnUpdate.className = 'btn btn-sm btn-outline-primary'
    const btnGroup = document.createElement('div')
    btnGroup.className = 'btn-group btn-group-sm mg-1 justify-content-end w-100'
    btnGroup.role = 'group'
    const div2 = document.createElement('div')
    div2.className = 'form-check form-switch'
    const input = document.createElement('input')
    input.className = 'form-check-input'
    input.type = 'checkbox'
    input.id = 'flexSwitchCheckDefault'
    input.checked = student.estudiante_estado === 'activo' ? true : false
    input.onchange = async () => updateState(student.estudiante_id.toString(), student.estudiante_estado)
    input.role = 'switch'
    const label = document.createElement('label')
    label.className = 'form-check-label'
    label.htmlFor = 'flexSwitchCheckDefault'
    label.innerText = student.estudiante_estado === 'activo' ? 'Desactivar' : 'Activar'
    div2.append(input, label)
    btnGroup.append(btnUpdate, div2)
    rowElement.append(btnGroup)
    studentList?.appendChild(rowElement)
  })
}

