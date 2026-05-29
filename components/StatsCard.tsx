import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { s, vs } from "react-native-size-matters";

const StatsCard = ({ icon, name, total }: Stats) => {
  return (
    <View style={style.card} className="bg-black">
      <Image source={icon} style={style.icon} />
      <Text
        className="text-white font-sans-extrabold"
        style={{ fontSize: 50, lineHeight: 50, includeFontPadding: false }}
      >
        {total}
      </Text>
      <Text
        className="text-white font-sans-extrabold"
        style={{ fontSize: s(15) }}
      >
        {name}
      </Text>
    </View>
  );
};

const style = StyleSheet.create({
  card: {
    paddingVertical: vs(20),
    paddingHorizontal: s(50),
    borderRadius: s(20),
    justifyContent: "center",
    paddingLeft: s(20),
    marginRight: s(15),
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    margin: vs(5),
  },
  icon: {
    width: s(40),
    height: vs(40),
  },
});

export default StatsCard;
