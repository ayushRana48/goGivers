import React from 'react';
import { View, Image } from 'react-native';

const Strikes = ({ strikes }: { strikes: number }) => {
  const imageSize = 40; // Adjust this width as needed

  const renderStrikes = () => {
    const strikeComponents = [];
    for (let i = 0; i < strikes; i++) {
      strikeComponents.push(<Image key={i} source={require('../../../../../assets/images/RedStrike.png')} style={{ marginHorizontal: 1, width: imageSize,resizeMode:'contain' }} />);
    }
    const emptyStrikes = 3 - strikes;
    for (let i = 0; i < emptyStrikes; i++) {
      strikeComponents.push(<Image key={i + strikes} source={require('../../../../../assets/images/EmptyStrike.png')} style={{ marginHorizontal: 1, width: imageSize,resizeMode:'contain' }} />);
    }
    return strikeComponents;
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center',marginLeft:'auto' }}>
      {renderStrikes()}
    </View>
  );
};

export default Strikes;
