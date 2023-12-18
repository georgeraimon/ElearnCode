import React from "react";
import { WhisperSpinner } from "react-spinners-kit";
import "./PreLoader.css";

export default function PreLoader() {
    return (
        <div className="pre-loader">
          <WhisperSpinner  size={75} frontColor="#23b0cf" backColor="#23b0cf"/>
        </div>
    );
}