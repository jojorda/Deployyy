package routes

// import (
// 	"housy/handlers"
// 	"housy/pkg/mysql"
// 	"housy/repositories"
// 	"housy/pkg/middleware"

// 	"github.com/gorilla/mux"
// )

// func FilterRoutes(r *mux.Router) {
// 	filterRepository := repositories.RepositoryFilter(mysql.DB)
// 	h := handlers.HandlerFilter(filterRepository)

// 	// r.HandleFunc("/singleFilter", middleware.Auth(h.SingleParameter)).Methods("GET")
// 	r.HandleFunc("/multiFilter", middleware.Auth(h.MultiParameter)).Methods("GET")

// }