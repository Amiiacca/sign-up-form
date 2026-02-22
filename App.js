import { useMemo, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Pressable, KeyboardAvoidingView, Platform} from 'react-native';
import { RadioGroup } from 'react-native-radio-buttons-group';

export default function App() {


  const radioButtons = useMemo(() => ([
    {
      id: '1', label: 'Male', value: 'male'
    },

    {
      id: '2', label: 'Female', value: 'female'
    }
  ]), []);

  const [selectedId, setSelectedId] = useState()

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'android' ? "padding" : undefined}>

      <Text>Sign-Up form</Text>
      <TextInput style={styles.firstName} placeholder='First Name'/>
      <TextInput style={styles.lastName} placeholder='Last Name'/>
        {/* Here should go radio button */}
      <RadioGroup
        radioButtons={radioButtons}
        onPress={setSelectedId}
        selectedId={selectedId}
      />

      <TextInput style={styles.agePicker} placeholder='Age'></TextInput>
      <TextInput style={styles.phoneNumber} placeholder='Phone Number'></TextInput>
      <TextInput style={styles.userEmail} placeholder='Email'></TextInput>
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
