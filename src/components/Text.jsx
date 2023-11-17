import React from "react";

const TextList = ({ title, texts }) => {
  return (
    <li className="flex flex-col bg-lime-300 rounded-md p-4">
      <h5 className="text-lg mb-2">{title} 🌱</h5>
      <div>
        {texts.map((text, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <div className="col-span-1 mt-5 bg-lime-500 p-4 rounded-md">
                <div className="text-gray-700 leading-relaxed">
                  <p>{text}</p>
                </div>
              </div>
            )}
            {index === 0 && (
              <div className="text-gray-700 leading-relaxed">
                <p>{text}</p>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </li>
  );
};

export default TextList;
