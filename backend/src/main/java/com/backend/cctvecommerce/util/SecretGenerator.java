package com.backend.cctvecommerce.util;

import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.io.Encoders;

import javax.crypto.SecretKey;

public class SecretGenerator {

    public static void main(String[] args) {

        SecretKey key = Keys.secretKeyFor(
                io.jsonwebtoken.SignatureAlgorithm.HS256
        );

        String secretString =
                Encoders.BASE64.encode(key.getEncoded());

        System.out.println(secretString);
    }
}
