package auth

import (
	"context"
	"errors"
	"net/http"
	"os"
	"time"

	"github.com/mpm1900/gokapi/internal/db"

	"github.com/golang-jwt/jwt/v5"
)

func WithJWT(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("jwt")
		if err != nil {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		jwt, err := ParseJWT(cookie.Value)
		if err != nil {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		next(w, r.Clone(context.WithValue(r.Context(), "jwt", jwt)))
	}
}

func getKey(token *jwt.Token) (any, error) {
	secret := []byte(os.Getenv("JWT_SECRET"))
	return secret, nil
}

func ParseJWT(tokenString string) (jwt.MapClaims, error) {
	options := jwt.WithValidMethods([]string{jwt.SigningMethodHS256.Alg()})
	token, err := jwt.Parse(tokenString, getKey, options)
	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil, errors.New("failed to parse claims")
	}

	return claims, nil
}

func CreateJWT(user *db.User) (string, error) {
	secret := []byte(os.Getenv("JWT_SECRET"))
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":    user.ID,
		"email": user.Email,
		"exp":   time.Now().Add(time.Hour * 24 * 365).Unix(),
	})
	tokenString, err := token.SignedString(secret)
	if err != nil {
		return "", err
	}
	return tokenString, nil
}
