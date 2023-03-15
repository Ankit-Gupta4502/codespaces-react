import { Box, Flex, Input, FormLabel, Stack, Button, Badge, Text } from '@chakra-ui/react'
import { useState } from "react"
import { createClient } from '@supabase/supabase-js'
function App() {
  const [auth, setAuth] = useState({
    email: "",
    password: ""
  })
  const [userType, setUserType] = useState("new")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState('')
  const [authDetails, setAuthDetails] = useState({})
  const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_KEY)
  const handleInput = (e) => setAuth(prev => {
    return { ...prev, [e.target.name]: e.target.value }
  })
  const signUp = async () => {
    setLoading(true)

    const { data, error } = await supabase.auth.signUp(
      {
        email: auth.email,
        password: auth.password
      }
    )
    if (data) {
      setAuthDetails(data);
      setLoading(false)
    }
    if (error.message) {
      setErrors(error.message)
      setLoading(false)
    }

  }

  const signIn = async () => {
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({
      email: auth.email,
      password: auth.password
    })

    if (data) {
      setAuthDetails(data);
      setLoading(false)
    }
    if (error.message) {
      // setErrors(error.message)
      console.log(error.message);
      setLoading(false)
    }
  }

  if (Object.keys(authDetails).length) {
    return <Text textAlign="center" marginTop="1.5" fontSize='sm'>In love with React & Chakra UI</Text>
  }


  return (
    <Flex width="100%" minHeight="100vh" justifyContent="center" alignItems="center" >
      <Box maxW='lg' paddingInline="10" paddingBlock="5" borderWidth='1px' borderRadius='lg' overflow='hidden'>
        <Stack direction="column" spacing="6" >
          <div>
            <FormLabel>
              Enter Your Email
            </FormLabel>
            <Input isInvalid={Boolean(errors)} onChange={handleInput} name="email" placeholder='Email' value={auth.email} />
          </div>
          <div>
            <FormLabel>
              Enter Your Password
            </FormLabel>
            <Input isInvalid={Boolean(errors)} type="password" onChange={handleInput} name="password" placeholder='Password' value={auth.password} />
          </div>
          {
            errors && <Badge p="2" borderRadius="md" colorScheme="red">
              {errors}
            </Badge>
          }
          <Button onClick={() => userType === "new" ? signUp() : signIn()} disabled={loading} colorScheme="teal" size="md" >
            {userType === "new" ? "Sign Up" : "Sign In"}
          </Button>
          <Text onClick={() => setUserType(prev => prev === "new" ? "existing" : "new")} role="button" fontSize="sm" color="teal.400" > {userType === "new" ? "Already have an account ? Sign in" : "Not have an account ? Sign up"}   </Text>
        </Stack>
      </Box>
    </Flex>
  );
}

export default App;
