package pl.kflorczyk;

import java.util.HashMap;

public class Util {
    public static HashMap<String, String> mapUrlQuery(String query) {
        HashMap<String, String> map = new HashMap<>();

        String[] params = query.split("&");
        for(String param : params) {
            int delimiter = param.indexOf("=");
            String key = param.substring(0, delimiter);
            String value = param.substring(delimiter+1);
            map.put(key, value);
        }

        return map;
    }
}
