import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { MotherStackParamList } from "./types"

import ListNoteScreen from "@app/mother/ListNote"
import AddNoteScreen from "@app/mother/AddNote"


const MotherStack = createNativeStackNavigator<MotherStackParamList>()

const MotherRouter: React.FC<{}> = () => {
  return (
    <MotherStack.Navigator
        screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: 'white', flex: 1 },
        animation: 'none'
        }}
    >
      <MotherStack.Screen name='list-note' component={ListNoteScreen} />
      <MotherStack.Screen name='add-note' component={AddNoteScreen} />
    </MotherStack.Navigator>
  )
}

export default MotherRouter