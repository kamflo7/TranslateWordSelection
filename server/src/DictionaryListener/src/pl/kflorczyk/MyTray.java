package pl.kflorczyk;

import javax.swing.*;
import java.awt.*;
import java.net.URL;

public class MyTray {

    public interface Listener {
        void onExitTrayItemClick();
        void onExportTrayItemClick();
        void onReloadTrayItemClick();
    }

    private static final String ICON = "iconNew.gif";
    private Listener listener;

    private final SystemTray tray;
    private final TrayIcon trayIcon;
    private final PopupMenu popup;
    private MenuItem wordsForExport;


    public MyTray(Listener listener) throws SystemTrayNotSupportedException {
        if (!SystemTray.isSupported()) {
            throw new SystemTrayNotSupportedException();
        }

        this.listener = listener;

        popup = new PopupMenu();
        trayIcon = new TrayIcon(createImage(ICON, "tray icon"));
        tray = SystemTray.getSystemTray();

        initMenuItems();
        updateInfoWordsExportAmount(-1);
    }

    private void initMenuItems() {
        wordsForExport = new MenuItem("Words waiting for export: -1");
        MenuItem reloadItem = new MenuItem("Reload words from file");
        MenuItem exitItem = new MenuItem("Exit");

        popup.add(wordsForExport);
        popup.add(reloadItem);
        popup.add(exitItem);
        trayIcon.setPopupMenu(popup);

        if(listener != null) {
            exitItem.addActionListener(e -> listener.onExitTrayItemClick());
            wordsForExport.addActionListener(e -> listener.onExportTrayItemClick());
            reloadItem.addActionListener(e -> listener.onReloadTrayItemClick());
        }

        try {
            tray.add(trayIcon);
        } catch (AWTException e) {
            System.out.println("TrayIcon could not be added.");
            System.exit(0);
        }
    }

    public void updateInfoWordsExportAmount(int amount) {
        wordsForExport.setLabel(String.format("Export words to anki [%d]", amount));
    }

    public void showNotification(String caption, String message) {
        showNotification(caption, message, TrayIcon.MessageType.INFO);
    }

    public void showNotification(String caption, String message, TrayIcon.MessageType type) {
        trayIcon.displayMessage(caption, message, type);
    }


    public void close() {
        tray.remove(trayIcon);
    }

    private Image createImage(String path, String description) {
        URL imageURL = MainController.class.getResource(path);

        if (imageURL == null) {
            System.err.println("Resource not found: " + path);
            return null;
        } else {
            return (new ImageIcon(imageURL, description)).getImage();
        }
    }
}
