// extra cart (main Cart)
  //  Steps
  // 1. Save to sales table and salesItems table
  //  Cash sale → paidAmount = totalAmount, balance = 0
  //  Debt sale → paidAmount = 0, balance > 0
  //  Partial → mixed payment

import { Text, View } from "react-native";

  // todo 2. if debt save sales as unpaid and debts table as open
  //  when customer pays update 
  // debts.amountPaid
  // update sales.paidAmount
  // update sales.balance

//?   When balance === 0:

  // sales.status = 'paid'
  // debts.status = 'paid'


  // user must view receipt in Sales → Today → Tap sale → Receipt
  
export default function MainCart () {
  return <View>
    <Text>This is main Cart!</Text>
  </View>
}