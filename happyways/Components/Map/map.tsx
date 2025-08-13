import React from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";

type MapProps = {
  latitude: number;
  longitude: number;
  zoom?: number;
};

const MapComponent = ({ latitude, longitude, zoom = 15 }: MapProps) => {
  const mapHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          html, body, #map {
            height: 100%;
            margin: 0;
            padding: 0;
          }
          iframe {
            border: 1px solid #ccc;
            border-radius: 10px;
          }
        </style>
      </head>
      <body>
        <iframe
          width="100%"
          height="100%"
          frameborder="0"
          scrolling="no"
          marginheight="0"
          marginwidth="0"
          src="https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01},${latitude - 0.01},${longitude + 0.01},${latitude + 0.01}&layer=mapnik&marker=${latitude},${longitude}"
        ></iframe>
      </body>
    </html>
  `;

  return (
    <View className="flex-1 bg-white rounded-[10px] overflow-hidden">
      <WebView
        originWhitelist={["*"]}
        source={{ html: mapHTML }}
        className="flex-1"
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
      />
    </View>
  );
};



export default MapComponent;
