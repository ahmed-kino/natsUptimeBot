import React, { useEffect, useState } from 'react'
import { Typography, Container } from '@mui/material'

type JSONObject =
  | string
  | number
  | boolean
  | null
  | JSONObject[]
  | { [key: string]: JSONObject }

type ID = number

type Target = {
  id: ID
  domainName: string
}

type Check = {
  id: ID
  target: Target
  name: string
  data: JSONObject
}

function Checks() {
  const [data, setData] = useState<Array<Check> | []>([])

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/checks`)
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error('Error:', error))
  }, [])

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        {data.map((d, i) => (
          <div key={i}>
            <ul>
              <li>id: {d.id}</li>
              <li>name: {d.name}</li>
              <li>target id: {d.target.id}</li>
              <li>target name: {d.target.domainName}</li>
            </ul>
          </div>
        ))}
      </Typography>
    </Container>
  )
}

export default Checks
