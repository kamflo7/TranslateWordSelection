package pl.kflorczyk;

import java.awt.*;
import java.awt.datatransfer.Clipboard;
import java.awt.datatransfer.StringSelection;
import java.io.*;
import java.util.regex.Pattern;

public class MainController implements MyTray.Listener, HttpWordReceiver.Listener {

//    private static final String CONFIG_FILE = "dictionaryListenerConfig.cfg";
//    private static final String CONFIG_LOCATION_KEY = "file_words_absolute_location";

    private MyTray tray;
    private HttpWordReceiver server;
    private WordsManager wordsManager;
    private String wordsFileLocation;

    public static void main(String[] args) {
        new MainController(args);
    }

    public MainController(String[] args) {
        setWordListFileLocation(args);
        createSystemTray();
//        checkConfigFile();
        createHttpServer();
        createWordsManager();

        tray.updateInfoWordsExportAmount(wordsManager.getWordsForExportAmount());
    }

    private void setWordListFileLocation(String[] args) {
        if(args.length == 0) {
            System.err.println("You have to specify words-list file");
            System.exit(0);
        } else {
            String[] parts = args[0].split(Pattern.quote("="));
            if(parts[0].equals("wordsList")) {
                wordsFileLocation = parts[1];
            } else {
                System.err.println("You have to specify words-list file");
                System.exit(0);
            }
        }
    }

    public void onExitTrayItemClick() {
        tray.close();
        System.exit(0);
    }

    public void onExportTrayItemClick() {
        if(wordsManager.getWordsForExportAmount() == 0) {
            tray.showNotification("Export words", "No words for export");
        } else {
            int amount = wordsManager.getWordsForExportAmount();
            java.util.List<TranslatedWord> list = wordsManager.exportWords();
            StringBuilder sr = new StringBuilder();

            for(TranslatedWord word : list) {
                sr.append(String.format("%s<div><i><sub>%s</sub></i></div>\t%s<div><sub>%s</sub></div>\n",
                        word.word, word.pronunciation, word.meaning, word.example));
            }

            StringSelection selection = new StringSelection(sr.toString());
            Clipboard clipboard = Toolkit.getDefaultToolkit().getSystemClipboard();
            clipboard.setContents(selection, selection);
            tray.showNotification(String.format("Exported %d words", amount), "You have exported data in clipboard");
            tray.updateInfoWordsExportAmount(wordsManager.getWordsForExportAmount());
        }
    }

    public void onReloadTrayItemClick() {
        try {
            wordsManager.loadWords();
            tray.updateInfoWordsExportAmount(wordsManager.getWordsForExportAmount());
            tray.showNotification("Reload", "Successfully reloaded words from file");
        } catch (IOException e) {
            e.printStackTrace();
            System.exit(0);
        }
    }

//    private void checkConfigFile() {
//        File f = new File(CONFIG_FILE);
//        if(!f.exists()) {
//            try(Writer writer = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(CONFIG_FILE), "utf-8"))) {
//                writer.write(CONFIG_LOCATION_KEY+"=");
//            } catch (Exception e) {
//                System.err.println("Problem with creating config file");
//                System.exit(0);
//            }
//            tray.showNotification("File config does not exist", "You have to specify file location of your words in config file");
//            System.exit(0);
//        } else {
//            try(BufferedReader br = new BufferedReader(new FileReader(CONFIG_FILE))) {
//                for(String line; (line = br.readLine()) != null;) {
//                    String[] params = line.split("=");
//                    if(params[0].equals(CONFIG_LOCATION_KEY)) {
//                        wordsFileLocation = params.length == 2 ? params[1] : "";
//                        break;
//                    }
//                }
//            } catch(IOException e) {
//                System.err.println("IOException while reading config file");
//                System.exit(0);
//            }
//        }
//    }

    private void createSystemTray() {
        try {
            tray = new MyTray(this);
        } catch (SystemTrayNotSupportedException e) {
            System.err.println("SystemTray is not supported");
            System.exit(0);
        }
    }

    private void createHttpServer() {
        try {
            server = new HttpWordReceiver(this);
        } catch (IOException e) {
            System.err.println("Problem with initializing http server");
            System.exit(0);
        }
    }

    private void createWordsManager() {
        try {
            wordsManager = new WordsManager(wordsFileLocation);
        } catch (IOException e) {
            System.err.println("Problem with initializing file manager");
            System.exit(0);
        }
    }

    @Override
    public void onReceiveCheckRequest(String word) {
        boolean contains = wordsManager.containsWord(word);

        String message = contains ? String.format("Word '%s' does exist in your dictionary!", word) :
                String.format("Word '%s' does NOT exist in your dictionary!", word);

        TrayIcon.MessageType type = contains ? TrayIcon.MessageType.INFO : TrayIcon.MessageType.WARNING;

        tray.showNotification("Word check", message, type);
    }

    @Override
    public void onReceiveInsertRequest(String word, String pronunciation, String meaning, String example) {
        boolean insertResult = wordsManager.insertWord(word, pronunciation, meaning, example);

        String message = insertResult ? String.format("Successfully added '%s' (%s)\n%s",
                word, meaning, example) :
                String.format("Problem with inserting word '%s'", word);

        tray.showNotification("Insert word", message);
        tray.updateInfoWordsExportAmount(wordsManager.getWordsForExportAmount());
    }


}
