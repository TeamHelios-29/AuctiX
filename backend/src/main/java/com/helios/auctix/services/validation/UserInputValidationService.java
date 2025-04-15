package com.helios.auctix.services.validation;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class UserInputValidationService {

    public static String validateEmail(String email){
        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
        Pattern pattern = Pattern.compile(emailRegex);
        Matcher matcher = pattern.matcher(email);
        if(matcher.matches()){
            return "Email is valied.";
        }
        else{
            return "Email is invalied.";
        }
    }

    public static String validatePassword(String plainPassword){
        // Check length
        if (plainPassword.length()>42 || plainPassword.length()<6) {
            return "Password length should be 6-42 characters long";
        }

        // Check for at least one capital letter
        String capitalLetterRegex = ".*[A-Z].*";
        Pattern capitalLetterPattern = Pattern.compile(capitalLetterRegex);
        Matcher capitalLetterMatcher = capitalLetterPattern.matcher(plainPassword);
        if (!capitalLetterMatcher.matches()) {
            return "Password must contains at least 1 capital letter.";
        }

        // Check for at least one simple letter
        String simpleLetterRegex = ".*[a-z].*";
        Pattern simpleLetterPattern = Pattern.compile(simpleLetterRegex);
        Matcher simpleLetterMatcher = simpleLetterPattern.matcher(plainPassword);
        if (!simpleLetterMatcher.matches()) {
            return "Password must contains at least 1 simple letter.";
        }

        // Check for at least one special character
        String specialCharRegex = ".*[!@#$%^&*(),.?\":{}|<>].*";
        Pattern specialCharPattern = Pattern.compile(specialCharRegex);
        Matcher specialCharMatcher = specialCharPattern.matcher(plainPassword);
        if (!specialCharMatcher.matches()) {
            return "Password must contains at least 1 special character.";
        }

        // Check for invalid characters (only letters, numbers, and special characters are allowed)
        String invalidCharRegex = "^[A-Za-z0-9!@#$%^&*(),.?\":{}|<>]*$";
        Pattern invalidCharPattern = Pattern.compile(invalidCharRegex);
        Matcher invalidCharMatcher = invalidCharPattern.matcher(plainPassword);
        return "Password is valied";

    }
}
