import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert, Pressable} from 'react-native';
import { RadioGroup } from 'react-native-radio-buttons-group';
import {Picker} from '@react-native-picker/picker';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

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
      const phone = values.phone?.trim()
      const phoneRegex = /^\+?[1-9][0-9]{7,14}$/

      if (!phone) errorFormat.phone = "Phone number required"
      else if(!phoneRegex.test(phone)) errorFormat.phone = "Not valid format"
    }

    const emailField = () => {
      const email = values.email?.trim();
      const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!email) errorFormat.email = "Email is required"
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

      errorFormat.password = `Provide a password that contains: ${missing.join(", ")}`;
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
  
  const isFormEmpty = Object.values(form).every(val => val === "")

  const validationErrors = validateValues(form)
  const isReady = Object.keys(validationErrors).length === 0;

  const [ touched, setTouched ] = useState({
    firstName: false,
    lastName: false,
    gender: false,
    country: false,
    age: false,
    phone: false,
    email: false,
    password: false,
  });

  const onChangeErrors = validateValues(form);

  const [submittedOnce, setSubmittedOnce] = useState(false);

  let formStatus = "Empty";
  if (!isFormEmpty) {
    if (isReady) formStatus = "Ready";
    else formStatus = submittedOnce ? "Incomplete" : "Changing";
  }

  useEffect(() => {
    if (!submittedOnce) return;
    setErrors(validateValues(form));
    }, [form, submittedOnce]);

  const [selectedId, setSelectedId] = useState()

  // const [ selectedLanguage, setSelectedLanguage ] = useState() --> Trying the picker library

  const [ countryList, setCountryList ] = useState([])
  const [ loadCountries, setLoadCountries ] = useState(true)

  const handleSubmit = () => {
    const newErrors = validateValues(form)
    setErrors(newErrors)
    setSubmittedOnce(true);
    
    if (Object.keys(newErrors).length > 0) {
      Alert.alert(
        "Missing Information",
        "Please fill in the empty fields correctly.",
        [{ text: "OK"}]
      )
      return
    }

    Alert.alert(
      "Success!",
      "Your form has been submitted.",
      [{text: "OK"}]
    )

    setForm(initialState.inputVals)
    setSelectedId(undefined)
    setErrors({})
    setSubmittedOnce(false)
    
  }

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
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView 
          style={{ flex: 1 }} 
          behavior={Platform.OS === 'android' ? 'padding' : undefined}>
            
            <ScrollView contentContainerStyle={styles.scrollArea}>

              <View style={styles.formStyle}>
                <Text style={styles.signUp}>Sign-Up form</Text>

                <Text style={styles.statusChange}>
                  Form Status: {formStatus}
                </Text>



                <Text style={styles.fieldName}>First Name</Text>
                <TextInput style={styles.txtFields}
                  placeholder='First Name'
                  value={form.firstName}
                  onChangeText={(t) => {
                    setForm(prev => ({ ...prev, firstName: t}))
                    setTouched(prev => ({ ...prev, firstName: true }))
                  }}
                  onBlur={() => setTouched(prev => ({ ...prev, firstName: true }))}
                />
                {(submittedOnce || touched.firstName) && onChangeErrors.firstName ? (
                  <Text style={styles.errorMsg}>{onChangeErrors.firstName}</Text>
                ) : null}


                <Text style={styles.fieldName}>Last Name</Text>
                <TextInput style={styles.txtFields} 
                placeholder='Last Name'
                value={form.lastName}
                onChangeText={(t) => {setForm(prev => ({ ...prev, lastName: t}))
                    setTouched(prev => ({ ...prev, lastName: true }))
                  }}
                  onBlur={() => setTouched(prev => ({ ...prev, lastName: true }))}
                />
                {(submittedOnce || touched.lastName) && onChangeErrors.lastName ? (
                  <Text style={styles.errorMsg}>{onChangeErrors.lastName}</Text>
                ) : null}


                <Text style={styles.fieldName}>Gender</Text>
                <RadioGroup
                  radioButtons={radioButtons}
                  selectedId={selectedId}
                  layout='row'
                  containerStyle={styles.radioBtnSty}
                  onPress={(id) => {
                    setSelectedId(id)
                    const picked = radioButtons.find(r => r.id === id)?.value || "";
                    setForm(prev => ({ ...prev, gender: picked}))
                    setTouched(prev => ({ ...prev, gender: true }));
                  }}
                  
                />
                {errors.gender ? <Text style={styles.errorMsg}>{errors.gender}</Text> : null}

                <Text style={styles.fieldName}>Country</Text>

                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={form.country}
                    onValueChange={(value) => {
                      setForm(prev => ({ ...prev, country: value }))
                      setTouched(prev => ({ ...prev, country: true }));
                    }}>
                      <Picker.Item 
                      label={loadCountries ? '' : 'Select a country'} value="" enabled={false}/>
                      {countryList.map ((name) => (
                        <Picker.Item key={name} label={name} value={name}/>
                      ))}
                    </Picker>
                </View>
                  {errors.country ? <Text style={styles.errorMsg}>{errors.country}</Text> : null}

                <Text style={styles.fieldName}>Age</Text>
                <TextInput style={styles.txtFields} 
                placeholder='Age'
                keyboardType='number-pad'
                value={form.age}
                onChangeText={(t) => {setForm(prev => ({ ...prev, age: t }))
                    setTouched(prev => ({ ...prev, age: true }))
                  }}
                  onBlur={() => setTouched(prev => ({ ...prev, age: true }))}
                />
                {(submittedOnce || touched.age) && onChangeErrors.age ? (
                  <Text style={styles.errorMsg}>{onChangeErrors.age}</Text>
                ) : null}


                <Text style={styles.fieldName}>Phone Number</Text>
                <TextInput style={styles.txtFields} 
                placeholder='Phone Number'
                keyboardType='number-pad'
                value={form.phone}
                onChangeText={(t) => {setForm(prev => ({ ...prev, phone: t }))
                    setTouched(prev => ({ ...prev, phone: true }))
                  }}
                  onBlur={() => setTouched(prev => ({ ...prev, phone: true }))}
                />
                {(submittedOnce || touched.phone) && onChangeErrors.phone ? (
                  <Text style={styles.errorMsg}>{onChangeErrors.phone}</Text>
                ) : null}

                <Text style={styles.fieldName}>Email</Text>
                <TextInput style={styles.txtFields}
                placeholder='Email'
                value={form.email}
                autoCapitalize='none'
                keyboardType='email-address'
                onChangeText={(t) => {setForm(prev => ({ ...prev, email: t }))
                    setTouched(prev => ({ ...prev, email: true }))
                  }}
                  onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
                />
                {(submittedOnce || touched.email) && onChangeErrors.email ? (
                  <Text style={styles.errorMsg}>{onChangeErrors.email}</Text>
                ) : null}
                
                <Text style={styles.fieldName}>Password</Text>
                <TextInput style={styles.txtFields} 
                placeholder='Password'
                secureTextEntry
                autoCapitalize='none'
                value={form.password}
                onChangeText={(t) => {setForm(prev => ({ ...prev, password: t }))
                    setTouched(prev => ({ ...prev, password: true }))
                  }}
                  onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
                />
                {(submittedOnce || touched.password) && onChangeErrors.password ? (
                  <Text style={styles.errorMsg}>{onChangeErrors.password}</Text>
                ) : null}

                <Pressable onPress={handleSubmit} style={{width: "100%"}}>
                  <LinearGradient
                    colors={["#c5dcf8e7", "#5899e99a"]}
                    start={{ x: 0, y: 2 }}
                    end={{ x: 1, y: 1 }}    
                    style={styles.btnGradient}
                  ><Text style={styles.btnText}>Submit</Text>
                  </LinearGradient>
                  
                </Pressable>

              </View>
          
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  scrollArea: {
    padding: 16,
  },

  formStyle: {
    width: "100%",
    maxWidth: '85%',
    alignSelf: "center",
    
  },

  signUp: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: "center",
    color: "#576372d0",
    padding: 0,
    borderRadius: 5,
    padding: 4,
    backgroundColor: "#d7dfe783",
    
  },

  statusChange: {
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
    color: '#878e99',
    fontWeight: '500',
    fontSize: 16,
    backgroundColor: "#dfe5eb99",
    borderRadius: 3,
    alignSelf: 'center',
    padding: 3,

  },

  txtFields: {
    borderWidth: 1,
    borderColor: "#778da9bc",
    borderRadius: 6,
    marginTop: 5,
    marginBottom: 15,
    backgroundColor: "rgba(213, 219, 226, 0.4)",
    opacity: 0.6,
    
  },

  errorMsg: {
    color: '#cd4040',
    backgroundColor: '#d2676713',
    fontSize: 14,
    marginBottom: 15,
    borderRadius: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 5,
    paddingVertical: 2,
    fontWeight: 600,
  },

  fieldName: {
    color: "#2a2d32a8",
    fontWeight: "500",
  },
  radioBtnSty: {
    marginBottom: 10,
    marginTop: 10
  },

  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#778da9bc",
    borderRadius: 6,
    marginTop: 5,
    marginBottom: 15,
    backgroundColor: "#d5dbe231",
    opacity: 0.6
  },


btnGradient: {
  width: "100%",
  paddingVertical: 12,
  paddingHorizontal: 16,
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 20
},

btnText: {
  fontWeight: "700",
  fontSize: 16,
  color: "#2f4968aa",
},
  
});
