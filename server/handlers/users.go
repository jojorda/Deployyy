package handlers

import (
	"encoding/json"
	authdto "housy/dto/auth"
	dto "housy/dto/result"
	usersdto "housy/dto/users"
	"housy/models"
	"housy/repositories"
	"net/http"
	"strconv"
	"fmt"
	"housy/pkg/bcrypt"

	"github.com/gorilla/mux"
	"github.com/golang-jwt/jwt/v4"
)

type handlerUser struct {
	UserRepository repositories.UserRepository
}

func HandlerUser(UserRepository repositories.UserRepository) *handlerUser {
	return &handlerUser{UserRepository}
}

func (h *handlerUser) FindUsers(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	users, err := h.UserRepository.FindUsers()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(err.Error())
	}

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: users}
	json.NewEncoder(w).Encode(response)
}

func (h *handlerUser) GetUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	id, _ := strconv.Atoi(mux.Vars(r)["id"])

	user, err := h.UserRepository.GetUser(id)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: convertResponse(user)}
	json.NewEncoder(w).Encode(response)
}

func (h *handlerUser) DeleteUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	id, _ := strconv.Atoi(mux.Vars(r)["id"])

	user, err := h.UserRepository.GetUser(id)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	data, err := h.UserRepository.DeleteUser(user)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: data}
	json.NewEncoder(w).Encode(response)
}

func convertResponse(u models.User) usersdto.UserResponse {
	return usersdto.UserResponse{
		ID:         u.ID,
		Fullname:   u.Fullname,
		Username:   u.Username,
		Email:      u.Email,
		Password:   u.Password,
		ListAsRole: u.ListAsRole,
		Address:    u.Address,
		Gender:     u.Gender,
		Phone:      u.Phone,
		Image:      u.Image,
	}
}

func (h *handlerUser) UpdateUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	request := new(authdto.SignUpRequest)
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	id, _ := strconv.Atoi(mux.Vars(r)["id"])
	user, err := h.UserRepository.GetUser(int(id))
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	if request.Fullname != "" {
		user.Fullname = request.Fullname
	}

	if request.Email != "" {
		user.Email = request.Email
	}

	if request.Username != "" {
		user.Username = request.Username
	}

	if request.Password != "" {
		user.Password = request.Password
	}

	if request.ListAsRole != "" {
		user.ListAsRole = request.ListAsRole
	}

	if request.Address != "" {
		user.Address = request.Address
	}

	if request.Gender != "" {
		user.Gender = request.Gender
	}

	if request.Phone != "" {
		user.Phone = request.Phone
	}

	// if request. != "" {
	// 	user.Image = request.Profile.Image
	// }

	data, err := h.UserRepository.UpdateUser(user)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: data}
	json.NewEncoder(w).Encode(response)
}

func (h *handlerUser) ChangePassword(w http.ResponseWriter, r *http.Request) { 
	w.Header().Set("Content-Type", "applocation/json") 
	
	request := new(authdto.ChangePasswordRequest) 
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil { 
	 w.WriteHeader(http.StatusBadRequest) 
	 response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()} 
	 json.NewEncoder(w).Encode(response) 
	 return 
	} 
	
	fmt.Print("PASSWORD berjalan") 
	
	userInfo := r.Context().Value("userInfo").(jwt.MapClaims) 
	userId := int(userInfo["id"].(float64)) 
	
	fmt.Print("Password Success") 
	
	user, err := h.UserRepository.GetUser(int(userId)) 
	if err != nil { 
	 w.WriteHeader(http.StatusBadRequest) 
	 response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()} 
	 json.NewEncoder(w).Encode(response) 
	 return 
	} 
	
	isValid := bcrypt.CheckPasswordHash(request.OldPassword, user.Password) 
	if !isValid { 
	 w.WriteHeader(http.StatusBadRequest) 
	 response := dto.ErrorResult{Code: http.StatusBadRequest, Message: "YOUR OLD PASSWORD DOESN'T MATCH!!!"} 
	 json.NewEncoder(w).Encode(response) 
	 return 
	} 
	
	newPassword, err := bcrypt.HashingPassword(request.NewPassword) 
	if err != nil { 
	 w.WriteHeader(http.StatusInternalServerError) 
	 response := dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()} 
	 json.NewEncoder(w).Encode(response) 
	} 
	
	user.Password = newPassword 
	
	data, err := h.UserRepository.ChangePassword(user) 
	if err != nil { 
	 w.WriteHeader(http.StatusInternalServerError) 
	 response := dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()} 
	 json.NewEncoder(w).Encode(response) 
	 return 
	} 
	
	w.WriteHeader(http.StatusOK) 
	response := dto.SuccessResult{Code: http.StatusOK, Data: data} 
	json.NewEncoder(w).Encode(response) 
   }