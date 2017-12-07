package pl.kflorczyk;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class WordsManager {

    private List<String> words;
    private int wordsToExport;
    private String fileLocation;

    public WordsManager(String fileLocation) throws IOException {
        this.fileLocation = fileLocation;

        File f = new File(fileLocation);
        if(!f.exists()) {
//            System.err.println("Target words file does not exist!");
//            System.exit(0);
            if(!f.createNewFile()) {
                System.err.println("Problem with words-list file.");
                System.exit(0);
            }
        }

        try {
            words = loadWords();
        } catch (IOException e) {
            throw e;
        }
    }

    public List<TranslatedWord> exportWords() {
        List<String> output = new ArrayList<>();
        List<TranslatedWord> list = new ArrayList<>();

        try(BufferedReader br = new BufferedReader(new InputStreamReader(new FileInputStream(fileLocation), "UTF-8"))) {
            for(String line; (line = br.readLine()) != null;) {
                if(line.length() == 0) continue;
                if(line.charAt(0) != '#') {
                    TranslatedWord tw = TranslatedWord.fromRowString(line);
                    if(tw != null) list.add(tw);
                    output.add("#" + line);
                } else {
                    output.add(line);
                }
            }
            br.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        try {
            File f = new File(fileLocation);
            f.delete();
            f.createNewFile();

            Files.write(Paths.get(fileLocation), output, StandardCharsets.UTF_8, StandardOpenOption.APPEND);
        } catch (IOException e) {
            e.printStackTrace();
        }

        wordsToExport = 0;
        return list;
    }

    public boolean containsWord(String word) {
        return words.contains(word);
    }

    public boolean insertWord(String word, String pronunciation, String meaning, String example) {
        List<String> str = Arrays.asList(String.format("%s\t%s\t%s\t%s",
                word, pronunciation, meaning, example));

        try {
            Files.write(Paths.get(fileLocation), str, StandardCharsets.UTF_8, StandardOpenOption.APPEND);
        } catch (IOException e) {
            e.printStackTrace();
        }

        words.add(word);
        wordsToExport++;
        return true;
    }

    public int getWordsForExportAmount() {
        return wordsToExport;
    }

    public List<String> loadWords() throws IOException {
        List<String> list = new ArrayList<>();
        wordsToExport = 0;

        try(BufferedReader br = new BufferedReader(new FileReader(fileLocation))) {
            for(String line; (line = br.readLine()) != null;) {
                String foreignWord = getForeignWordFromRow(line);
                list.add(foreignWord);
            }
        }

        return list;
    }

    private String getForeignWordFromRow(String row) {
        int firstTab = row.indexOf("\t");

        if(firstTab != -1)
            row = row.substring(0, firstTab);

        if(row.contains("#"))
            row = row.substring(1);
        else
            wordsToExport++;

        return row;
    }
}
