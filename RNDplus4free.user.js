// ==UserScript==
// @name     RNDplus4free
// @description Laden des Artikel-Textes aus dem JSON im Quelltext
// @version  0.5.7
// @match https://*.haz.de/*.html*
// @match https://*.neuepresse.de/*.html*
// @match https://*.sn-online.de/*.html*
// @match https://*.waz-online.de/*.html*
// @match https://*.dnn.de/*.html*
// @match https://*.goettinger-tageblatt.de/*.html*
// @match https://*.lvz.de/*.html*
// @match https://*.ln-online.de/*.html*
// @match https://*.maz-online.de/*.html*
// @match https://*.ostsee-zeitung.de/*.html*
// @match https://*.paz-online.de/*.html*
// @match https://*.sn-online.de/*.html*
// @match https://*.rnd.de/*.html*
// ==/UserScript==

function extractTextAndHeaderSrc(content) {
  const textArray = []; // Create an empty array to store extracted text and header

  // Loop through each element in the content object
  content.elements.forEach(element => {
    if (element.type === "text") {
      // If the element type is "text", create a paragraph element with a class "article-text" and push it to the textArray
      textArray.push("<p class=\"article-text\">"+element.text+"</p>");
    } else if (element.type === "header") {
      // If the element type is "header", create a paragraph element with a class "article-header" and push it to the textArray
      textArray.push("<p class=\"article-header\">"+element.text+"</p>");
    } else if (element.type === "image") {
      // If the element type is "image", create a div element with a class "Imagestyled__Container-sc-1io480m-0 fAGtfK", containing an image element with a source (src) value from the element's imageInfo object, and push it to the textArray
      textArray.push("<div data-testid=\"image\" class=\"ArticleImagestyled__ArticleImageContainer-sc-11hkcjt-0 fAGtfK\"><img src="+element.imageInfo.src+"></div>");
    }
  });

  // Return an object with the extracted text and header as a property called "text"
  return {
    text: textArray
  };
}


function removeElementByTag(tagName) {
  const elements = document.getElementsByTagName(tagName); // Get all elements with the specified tag name from the document
  const elementsArray = Array.from(elements); // Convert the HTMLCollection of elements to an array for easier manipulation
  elementsArray.forEach(singleElement => {
    singleElement.remove(); // Loop through each element in the array and remove it from the document
  });
}


function deleteElementsByTypeAndClassPart(type, classPart) {
  const elements = document.getElementsByTagName(type); // Get all elements with the specified tag type from the document
  const regex = new RegExp(classPart, 'g'); // Create a regular expression object with the specified class name part as a pattern to match

  for (let i = elements.length - 1; i >= 0; i--) {
    const element = elements[i]; // Get the current element in the loop
    const classNames = element.className.split(' '); // Split the class names of the element into an array for easier manipulation

    for (let j = classNames.length - 1; j >= 0; j--) {
      if (classNames[j].match(regex)) { // Check if any of the class names match the specified class name part using the regular expression
        element.parentNode.removeChild(element); // If a match is found, remove the element from its parent node in the document
        break; // Exit the inner loop since only one match is needed
      }
    }
  }
}


function deleteClassByPart(className, classPart) {
  const regex = new RegExp(classPart, 'g'); // Create a regular expression object with the specified class name part as a pattern to match
  const elements = document.getElementsByClassName(className); // Get all elements with the specified class name from the document

  for (let i = 0; i < elements.length; i++) { // Loop through each element with the specified class name
    const obj = elements[i]; // Get the current element in the loop
    const classNames = obj.className.split(' '); // Split the class names of the element into an array for easier manipulation
    const updatedClassNames = classNames.filter(className => !className.match(regex)); // Use the filter() method to create a new array containing only the class names that do not match the specified class name part

    obj.className = updatedClassNames.join(' '); // Join the updated class names array back into a string and set it as the new value for the element's className property, effectively removing the class names that match the specified class name part
  }
}


function updateParagraphContentWithClass(objType, className, newContent) {
  // Find the first element that matches the specified object type and has a class name that starts with the specified class name
  const paragraphElement = document.querySelector(`${objType}[class^="${className}"]`);

  if (paragraphElement) {
    // If an element is found, update its innerHTML with the new content
    paragraphElement.innerHTML = newContent;
  } else {
    // If no element is found, log an error message to the console
    console.error(`${objType} element with class "${className}" not found.`);
  }
}


// Added timeout to get around the annoying lazy loading of the website resources 
setTimeout(function() {
    console.log("Waiting...");
    const extractedValues = extractTextAndHeaderSrc(Fusion.globalContent); // Call the function with Fusion.globalContent as the argument and store the returned result in extractedValues
    console.log("Extracted text: ", extractedValues.text); // Output the extracted text and header values to the console

    const toRemoveObjTypeToRemoveClassByTagName = "svg"; // Define the tag name of the elements to be removed
    removeElementByTag(toRemoveObjTypeToRemoveClassByTagName); // Call the function with the specified tag name to remove all elements with that tag name from the document

    const toRemoveObjTypeToRemoveClassByClassName = 'div'; // Define the tag type of the elements to be removed
    const toRemoveClassByClassName = "ArticleContentLoaderstyled__Gradient-sc-1npmba7-0"; // Define the class name part to match for elements to be removed
    deleteElementsByTypeAndClassPart(toRemoveObjTypeToRemoveClassByClassName, toRemoveClassByClassName); // Call the function with the specified tag type and class name part to remove all elements with that tag type and matching class name part from the document

    deleteClassByPart('ArticleHeadstyled__ArticleTeaserContainer-sc-tdzyy5-1', 'fJDcrZ'); // Call the function with the specified class name and class name part to remove the class names that match the specified class name part from all elements with the specified class name in the document

    const objType = 'div'; // The type of HTML element to search for
    const className = 'Articlestyled__ArticleBodyWrapper-sc-7y75gq-1'; // The starting part of the class name to match
    const newContent = extractedValues.text.join("<br />"); // The new content to set for the matching element, joined with "<br />" as a line break
    updateParagraphContentWithClass(objType, className, newContent); // Call the function with the specified object type, class name, and new content to update the innerHTML of the matching element


    const styleElement = document.createElement('style'); // Create a new <style> element
    document.head.appendChild(styleElement); // Append the <style> element to the <head> of the document

    // Insert CSS rules into the style sheet of the <style> element
    styleElement.sheet.insertRule('.article-text { color: #fff; mix-blend-mode: difference; margin: 0px; padding-bottom: 8px; padding-top: 8px; font-family: "Source Serif Pro", Palatino, "Droid Serif", serif; font-size: 17px; font-weight: 600; letter-spacing: 0px; line-height: 26px; }', 0);
    styleElement.sheet.insertRule('.article-header { color: #fff; mix-blend-mode: difference; font-family: "DIN Next LT Pro", Arial, Roboto, sans-serif; font-weight: 700; letter-spacing: -0.25px; font-size: 24px; line-height: 30px; }', 0);
}, 1000);
