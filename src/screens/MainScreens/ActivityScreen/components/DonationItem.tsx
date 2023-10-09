import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Linking } from 'react-native';
import { Record } from '../../../../types/types';

const DonationItem = ({ navigation, item, groupId }: { navigation: any; item: Record; groupId: String | undefined }) => {
  const { amount, loser, paid, date } = item;

  useEffect(() => {
    console.log(item, "item")

  }, [])

  function toDonation() {
    navigation.navigate("Donations", { amount: item.amount })

  }



  return (
    <Pressable onPress={toDonation}>
      <View style={styles.container}>
        <View style={styles.emphasizedContainer}>
          <Text style={styles.emphasizedText}>${amount}</Text>
          <Text style={styles.emphasizedText}>{loser}</Text>
          {groupId && <Text>{groupId}</Text>}
        </View>
        <View style={styles.detailsContainer}>
          <Text>{`Paid: ${paid ? 'Yes' : 'No'}`}</Text>
          {date && <Text>{date.toString().substring(0, 10)}</Text>}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  emphasizedContainer: {
    flexDirection: 'row',
  },
  emphasizedText: {
    marginRight: 10,
    fontWeight: 'bold',
  },
  detailsContainer: {
    marginLeft: 10,
  },
});

export default DonationItem;
