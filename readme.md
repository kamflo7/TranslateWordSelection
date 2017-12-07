# Translate Word Selection

Simple chrome extension that improves the search for the definition of an unknow word. You only need to select interested word, press shortcut and you get the result. In addition, extension sends a request to a local server running on your PC to check if the word you are looking for exists in your words list and informs you about that. If word does not exist you can create new a word definition in your list by pressing another shortcut. You will see a dialog with inputs for word, meaning, pronunciation, example to fill. In this way you can fast translate unknow words, add these words to list and finally export this list to Anki which is common spaced repetition system program.

[More about Anki](https://apps.ankiweb.net/)

## Demo
[Youtube link](https://www.youtube.com/watch?v=RlyYxkCBg2M)

## Installation
### Chrome extension
Go to 'extension' directory and copy whole 'TranslateWordSelection' dictionary to your computer, and next drag and drop this dictionary to chrome's site 'chrome://extensions'. After this you will see your new installed extension there, copy its ID and paste it to the files 'background.js' and 'injectDialog.js' to the var 'id' like this:

```
// CHANGE THIS LINE BELOW TO APPROPRIATE ID:
var id = "ajgehhgkbegbofgojojikbmecegofkgd"
```

And after that reload extension (in 'chrome://extension' page press CTRL+R).

### Local server
Go to 'server/build' dictionary, copy its files to your computer. Basically you need only run DictionaryListener.jar with required one argument named 'wordsList' which is a path to your file where you store words. Run example:

```
java -jar DictionaryListener.jar wordsList=C:\words.txt
```

But if you want to run this automatically with system, paste DictionaryListener.jar to your computer (for example: C:\CustomSoftware\) and DictionaryListenerInit.bat to you system startup dictionary, in Windows this is in:

```
C:\Users\{{YOUR_USERNAME}}\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup
```

And edit this file to something like this:

```
cd /d c:\CustomSoftware\
start DictionaryListener.jar wordsList=C:\Users\YOUR_NAME\Documents\words.txt
```