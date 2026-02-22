import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, KeyboardAvoidingView, Platform} from 'react-native';
import { RadioGroup } from 'react-native-radio-buttons-group';
import {Picker} from '@react-native-picker/picker';

export default function App() {

  const initialState = {
    inputVals: {
      firstName: "",
      lastName: "",
      gender: "",
      country: "",
      age: "",
      phone: "",
      email: "",
      password: "",
    },
    errorFormat: {},
    status: "Empty",
    submition: false,

  }

  const validateValues = (values) => {
    const errorFormat = {}

    const NamesValidation = () => {
      if (!values.firstName.trim()) errorFormat.firstName = "First name required";
      if (!values.lastName.trim()) errorFormat.lastName = "Last name required"
    };

    const genderVal = () => {
      if (!values.gender) errorFormat.gender = "Please specify your gender";
    }

    const countryChoice = () => {
      if (!values.country) errorFormat.country = "Please select a country"
    }

    const ageVal = () => {
      const ageStr = values.age?.toString().trim(); 
      const ageNum = Number(ageStr);

      if (!ageStr) {
        errorFormat.age = "Age is required";
      } else if (!Number.isInteger(ageNum)) {
        errorFormat.age = "Please specify a correct format (e.g., 20)";
      } else if (ageNum > 130) {
        errorFormat.age = "You must be 130 or younger";
      } else if (ageNum < 18) {
        errorFormat.age = "You should be at least 18";
      }
  };

    const phoneVal = () => {
      const phone = values.phone?.trim
      const phoneRegex = /^\+?[1-9][0-9]{7,14}$/;

      if (!phone) errorFormat.phone = "Phone number required"
      else if(!phoneRegex.test(phone)) errorFormat = "Not valid format"
    }

    const emailField = () => {
      const email = values.phone.trim();
      const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!email) ErrorUtils.email = "Email is required"
      else if(!emailReg.test(email)) errorFormat.email = "Not valid email"
    }

    const passw = () => {
      const pw = values.password || "";
      const minLen = pw.length >= 8;
      const pwUpper = /[A-Z]/.test(pw);
      const pwNum = /\d/.test(pw);
      const pwSpecialSym = /[^A-Za-z0-9]/.test(pw);

      if (!minLen || !pwUpper || !pwNum || !pwSpecialSym) {
      const missing = [];
      if (!minLen) missing.push("8+ characters");
      if (!pwUpper) missing.push("1 uppercase letter");
      if (!pwNum) missing.push("1 number");
      if (!pwSpecialSym) missing.push("1 special character");

      errorFormat.password = `Password needs: ${missing.join(", ")}`;
      }
    };

    NamesValidation();
    genderVal();
    countryChoice();
    ageVal();
    phoneVal();
    emailField();
    passw();

    return errorFormat;

  }

  const radioButtons = useMemo(() => ([
    {
      id: '1', label: 'Male', value: 'male'
    },

    {
      id: '2', label: 'Female', value: 'female'
    }
  ]), []);

  const [ form, setForm ] = useState(initialState.inputVals)
  const [ errors, setErrors ] = useState({})
  const [ status, setStatus ] = useState("Empty");

  const [selectedId, setSelectedId] = useState()

  // const [ selectedLanguage, setSelectedLanguage ] = useState() --> Trying picker library

  const [ country, setCountry ] = useState('');
  const [ countryList, setCountryList ] = useState([]);
  const [ loadCountries, setLoadCountries ] = useState(true);

  useEffect (() => {
    let screenChanged = false;
    async function countryLoad () {
      try {
        setLoadCountries(true);
        const requestData = await fetch('https://restcountries.com/v3.1/all?fields=name');
        const renderData = await requestData.json();

        const countryNames = renderData
        .map(c => c?.name?.common)
        .filter(Boolean)
        .sort((a,b) => a.localeCompare(b))

        if (!screenChanged) setCountryList(countryNames)
      } catch (e) {
        if (screenChanged) setCountryList([]);
    } finally {
        if (!screenChanged) setLoadCountries(false);
    }
    }
    countryLoad()
    return () => {
      screenChanged = true;
    }
  }, [])

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'android' ? "padding" : undefined}>

        <Text style={styles.signUp}>Sign-Up form</Text>

        <Text>First Name</Text>
        <TextInput style={styles.firstName} placeholder='First Name'/>

        <Text>Last Name</Text>
        <TextInput style={styles.lastName} placeholder='Last Name'/>

        <Text>Gender</Text>
        <RadioGroup
          radioButtons={radioButtons}
          onPress={setSelectedId}
          selectedId={selectedId}
        />

        <Text>Country</Text>
        <Picker
          selectedValue={country}
          onValueChange={(value) =>
            setCountry(value)
          }>
            <Picker.Item label={loadCountries ? '' : 'Select a country'} value=""/>
            {countryList.map ((name) => (
              <Picker.Item key={name} label={name} value={name} />
            ))}
          </Picker>

        <Text>Age</Text>
        <TextInput style={styles.agePicker} placeholder='Age'></TextInput>

        <Text>Phone Number</Text>
        <TextInput style={styles.phoneNumber} placeholder='Phone Number'></TextInput>

        <Text>Email</Text>
        <TextInput style={styles.userEmail} placeholder='Email'></TextInput>
        
        <Text>Password</Text>
        <TextInput style={styles.password} placeholder='Password'></TextInput>

        <Button title='Submit'></Button>

      </KeyboardAvoidingView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

});
