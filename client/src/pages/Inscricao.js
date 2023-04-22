import React from 'react'
import {Formik, Form, Field} from "formik";

function Inscricao() {
  return (
    <div className='Inscrição'>
        <Formik>
        <Form className='formContainer'>
        <h1>Inscrição Jogadores</h1>
        <label>Clube: </label>
          <select>
            <option selected value="Sabugo">Sabugo</option>
            <option value="Saloios">Saloios Dº Maria</option>
            <option value="Maceira">Maceira</option>
            <option value="Montelavar">Montelavar</option>
            <option value="Negrais">Negrais</option>
            <option value="Almargem">Almargem Do Bispo</option>
            <option value="Albogas">Albogas</option>
            <option value="Vale">Vale De Lobo</option>
            <option value="Camaroes">Camarões</option>
            <option value="Anços">Anços</option>
            <option value="Camponeses">Camponeses Dº Maria</option>
            <option value="Covas">Covas De Ferro</option>
            <option value="Pêro">Pêro Pinheiro</option>
          </select>
          <label>Nome: </label>
          <Field
          autoComplete="off" 
          id ="name" 
          name="Nome" 
          placeholder="Ex. João Pedro Pascal"/>
          <label>Morada: </label>
          <Field
          autoComplete="off" 
          id ="morada" 
          name="morada" 
          placeholder="Ex. Rua Mario Santos nº33"/>
          <label>Código Postal: </label>
          <Field
          autoComplete="off" 
          id ="cpostal" 
          name="cpostal" 
          placeholder="Ex. 2453-993"/>
          <label>Contacto: </label>
          <Field
          autoComplete="off" 
          id ="contacto" 
          name="contacto" 
          placeholder="Ex. 945645321"/>
          <label>Email: </label>
          <Field
          autoComplete="off" 
          id ="email" 
          name="email" 
          placeholder="Ex. teste@gmail.com"/>
          <label>Nº CC: </label>
          <Field
          autoComplete="off" 
          id ="cc" 
          name="cc" 
          placeholder="Ex. 155555554XW3"/>
          <label>Nº CC Enc.Educação: </label>
          <Field
          autoComplete="off" 
          id ="ccpais" 
          name="ccpais" 
          placeholder="Ex. 15566524ZW3"/>
          <label>Data Nascimento: </label>
          <input type='date'/>
          <label>Imagem: </label>
          <input type='file'/>
          <label>Ficha de Inscrição PDF: </label>
          <input type='file'/>
          <button type='submit'>Inscrever Técnico</button>
        </Form>
      </Formik>
    </div>
  )
}

export default Inscricao
