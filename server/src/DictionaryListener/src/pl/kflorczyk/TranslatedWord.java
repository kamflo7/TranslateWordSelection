package pl.kflorczyk;

public class TranslatedWord {
    public String word, pronunciation, meaning, example;

    public TranslatedWord(String word, String pronunciation, String meaning, String example) {
        this.word = word;
        this.pronunciation = pronunciation;
        this.meaning = meaning;
        this.example = example;
    }

    public static TranslatedWord fromRowString(String line) {
        String[] pieces = line.split("\t");
        if(pieces.length != 4)
            return null;

        return new TranslatedWord(pieces[0], pieces[1], pieces[2], pieces[3]);
    }

    @Override
    public String toString() {
        return "TranslatedWord{" +
                "word='" + word + '\'' +
                ", pronunciation='" + pronunciation + '\'' +
                ", meaning='" + meaning + '\'' +
                ", example='" + example + '\'' +
                '}';
    }
}
