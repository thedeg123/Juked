import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Text
} from "react-native";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { withNavigation } from "react-navigation";
import colors from "../../constants/colors";
import { Audio } from "expo-av";
import navigateContent from "../../helpers/navigateContent";

const MusicPlayer = ({ navigation, content, onClose }) => {
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [oldContentID, setOldContentID] = useState(null);
  const [sound, setSound] = useState(new Audio.Sound());

  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    Audio.setAudioModeAsync({
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX
    });
  }, []);

  useEffect(() => {
    const changeContent = async () => {
      if (content.id !== oldContentID) {
        if (oldContentID) await stopMusic(false);
        return updateMusic(false, false);
      }
    };
    changeContent();
  }, [content.id]);

  const stopMusic = async (done = true) => {
    await sound.unloadAsync();
    setPosition(0);
    if (done) onClose();
  };

  const updateMusic = async (pause = false, loaded) => {
    if (!loaded) {
      await sound.loadAsync({ uri: content.preview_url, downloadFirst: true });
      setOldContentID(content.id);
    }
    if (pause) {
      sound.pauseAsync();
    } else {
      sound.playAsync();
    }
    sound.setOnPlaybackStatusUpdate(val => {
      if (val.didJustFinish) {
        stopMusic();
      } else {
        setPosition((val.positionMillis / val.durationMillis) * screenWidth);
      }
      setPlaying(val.isPlaying);
    });
  };

  const MusicControls = () => (
    <View style={{ marginLeft: 10, flexDirection: "row" }}>
      <TouchableOpacity
        style={{
          height: 40,
          width: 40,
          alignItems: "center",
          justifyContent: "center",
          paddingRight: 5
        }}
        onPress={() => updateMusic(playing, true)}
      >
        <Entypo
          name={playing ? "controller-paus" : "controller-play"}
          size={25}
          color={colors.primary}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={{ padding: 10, paddingLeft: 5 }}
        onPress={stopMusic}
      >
        <AntDesign name="down" size={25} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );

  const ProgressBar = () => (
    <View
      style={{
        height: 2,
        top: 2,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        width: position || 0,
        backgroundColor: colors.primary
      }}
    />
  );
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          marginHorizontal: 10,
          flexDirection: "row",
          alignItems: "center"
        }}
      >
        <TouchableOpacity
          style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
          onPress={() =>
            navigateContent(navigation, null, null, null, content, null)
          }
        >
          <View style={[styles.shadow]}>
            <Image
              style={[
                styles.imageStyle,
                { width: playing ? 40 : 35, marginRight: playing ? 5 : 10 }
              ]}
              source={{
                uri: content.image
              }}
            />
          </View>
          <Text
            numberOfLines={1}
            style={{
              fontSize: 18,
              color: colors.text,
              textAlign: "center",
              flex: 1
            }}
          >
            {content.name}
          </Text>
        </TouchableOpacity>
        <MusicControls />
      </View>
      <ProgressBar />
    </View>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: colors.darkShadow,
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 6,
    elevation: 10
  },
  imageStyle: {
    width: "50%",
    marginRight: 5,
    width: 40,
    aspectRatio: 1,
    borderRadius: 2,
    borderWidth: 0.5,
    borderColor: colors.lightShadow
  }
});

export default withNavigation(MusicPlayer);
