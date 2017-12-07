package pl.kflorczyk;

import com.sun.net.httpserver.HttpServer;

import java.io.*;
import java.net.InetSocketAddress;
import java.util.Map;

public class HttpWordReceiver {
    public static final String KEY_WORD = "w";
    public static final String KEY_PRONUNCIATION = "p";
    public static final String KEY_MEANING = "m";
    public static final String KEY_EXAMPLE = "e";

    public interface Listener {
        void onReceiveCheckRequest(String word);
        void onReceiveInsertRequest(String word, String pronunciation, String meaning, String example);
    }

    private HttpServer server;
    private Listener listener;

    public HttpWordReceiver(Listener listener) throws IOException {
        try {
            server = HttpServer.create(new InetSocketAddress(9898), 0);
            createContexts();
            server.start();
        } catch (IOException e) {
            throw e;
        }

        this.listener = listener;
    }

    private void createContexts() {
        server.createContext("/insertWord", (t) -> {
            String query = t.getRequestURI().getQuery();

            String response = "[/insertWord] Query: " + query;
            System.out.println(response);

            if(listener != null) {
                Map<String, String> map = Util.mapUrlQuery(query);
                listener.onReceiveInsertRequest(map.get(KEY_WORD), map.get(KEY_PRONUNCIATION), map.get(KEY_MEANING), map.get(KEY_EXAMPLE));
            }

            t.sendResponseHeaders(200, response.length());
            OutputStream os = t.getResponseBody();
            os.write(response.getBytes());
            os.close();
        });

        server.createContext("/checkWord", (t) -> {
            String word = t.getRequestURI().getQuery();
            word = word.substring(word.indexOf("=")+1);

            String response = "[/checkWord] This is a response: " + word;
            System.out.println(response);

            if(listener != null)
                listener.onReceiveCheckRequest(word);

            t.sendResponseHeaders(200, response.length());
            OutputStream os = t.getResponseBody();
            os.write(response.getBytes());
            os.close();
        });
    }
}
