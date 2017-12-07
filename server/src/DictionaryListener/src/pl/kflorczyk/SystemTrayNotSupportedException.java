package pl.kflorczyk;

public class SystemTrayNotSupportedException extends Exception {

    public SystemTrayNotSupportedException() {}

    public SystemTrayNotSupportedException(String message) {
        super(message);
    }
}
